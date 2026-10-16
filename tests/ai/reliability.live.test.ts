
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  StartupAnalysisSchema,
  type StartupAnalysis,
} from "@/schemas/analysis";

import type {
  StartupInput,
} from "@/schemas/startup";

import {
  reliabilityCases,
} from "@/lib/ai/reliability-cases";

// Live tests are disabled by default.
const RUN_LIVE_AI_TESTS =
  process.env.RUN_LIVE_AI_TESTS === "true";

// Next.js server must be running for live tests.
const API_URL =
  process.env.TEST_API_URL ??
  "http://localhost:3001/api/analyze";

// Only run when explicitly opted in.
const maybeDescribe = RUN_LIVE_AI_TESTS
  ? describe
  : describe.skip;

// Timeout for one live test.
const TEST_TIMEOUT_MS = 120_000;

// --------------------------------------------------
// HTTP helper
// --------------------------------------------------

async function requestAnalysis(
  input: StartupInput,
): Promise<StartupAnalysis> {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(input),

    signal: AbortSignal.timeout(90_000),
  });

  // Read as text FIRST because the server
  // might return plain text or HTML on failure.
  const rawBody = await response.text();

  const requestId =
    response.headers.get("X-Request-ID");

  const contentType =
    response.headers.get("content-type") ??
    "unknown";

  // Check HTTP status before attempting JSON.parse.
  if (!response.ok) {
    throw new Error(
      [
        "AI analysis request failed.",
        `HTTP Status: ${response.status}`,
        `Content-Type: ${contentType}`,
        `Request ID: ${requestId ?? "N/A"}`,
        `Response: ${rawBody.slice(0, 500)}`,
      ].join("\n"),
    );
  }

  // Safely parse response body.
  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error(
      [
        "AI API returned invalid JSON.",
        `HTTP Status: ${response.status}`,
        `Content-Type: ${contentType}`,
        `Request ID: ${requestId ?? "N/A"}`,
        `Response: ${rawBody.slice(0, 300)}`,
      ].join("\n"),
    );
  }

  // Verify that the JSON object contains analysis.
  if (
    typeof body !== "object" ||
    body === null ||
    !("analysis" in body)
  ) {
    throw new Error(
      "AI API response does not contain an analysis field.",
    );
  }

  // Validate the model output with the strict
  // Stage 2 product contract.
  const parsed = StartupAnalysisSchema.safeParse(
    body.analysis,
  );

  if (!parsed.success) {
    throw new Error(
      [
        "AI output failed schema validation.",
        parsed.error.issues
          .map(
            (issue) =>
              `${issue.path.join(".")}: ${issue.message}`,
          )
          .join("\n"),
      ].join("\n"),
    );
  }

  return parsed.data;
}

// --------------------------------------------------
// Reusable property assertions
// --------------------------------------------------

function assertUniversalProperties(
  analysis: StartupAnalysis,
) {
  const scores = [
    analysis.scores.market.score,
    analysis.scores.product.score,
    analysis.scores.defensibility.score,
  ];

  // All scores must be integers between 1 and 10.
  for (const score of scores) {
    expect(Number.isInteger(score)).toBe(true);
    expect(score).toBeGreaterThanOrEqual(1);
    expect(score).toBeLessThanOrEqual(10);
  }

  // All rationales must be meaningful.
  for (const score of Object.values(
    analysis.scores,
  )) {
    expect(
      score.rationale.trim().length,
    ).toBeGreaterThanOrEqual(20);
  }

  // Required collections must be non-empty.
  expect(
    analysis.strengths.length,
  ).toBeGreaterThanOrEqual(2);

  expect(
    analysis.risks.length,
  ).toBeGreaterThanOrEqual(2);

  expect(
    analysis.potentialMoat.length,
  ).toBeGreaterThanOrEqual(2);

  expect(
    analysis.founderQuestions.length,
  ).toBeGreaterThanOrEqual(2);

  expect(
    analysis.informationGaps.length,
  ).toBeGreaterThanOrEqual(2);

  // Valid confidence.
  expect(
    ["Low", "Medium", "High"],
  ).toContain(analysis.confidence);

  // Required explanations.
  expect(analysis.summary.trim().length)
    .toBeGreaterThanOrEqual(30);

  expect(
    analysis.businessModelAssessment.trim().length,
  ).toBeGreaterThanOrEqual(30);

  expect(analysis.verdict.trim().length)
    .toBeGreaterThanOrEqual(30);

  expect(
    analysis.recommendedNextStep.trim().length,
  ).toBeGreaterThanOrEqual(20);
}

// --------------------------------------------------
// Live AI reliability suite
// --------------------------------------------------

maybeDescribe(
  "StartupLens live AI reliability",
  () => {
    it.each(reliabilityCases)(
      "$name",

      async ({ input, expectations }) => {
        // Actual OpenAI call through Next.js API.
        const analysis = await requestAnalysis(
          input,
        );

        // 1. Structural and quality checks.
        assertUniversalProperties(analysis);

        // 2. Confidence calibration.
        expect(
          expectations.allowedConfidence,
        ).toContain(analysis.confidence);

        // 3. Information gaps.
        expect(
          analysis.informationGaps.length,
        ).toBeGreaterThanOrEqual(
          expectations.minInformationGaps,
        );

        // 4. Scores.
        const scores = [
          analysis.scores.market.score,
          analysis.scores.product.score,
          analysis.scores.defensibility.score,
        ];

        // Prevent unjustified perfect scores.
        if (
          expectations.forbidAllPerfectScores
        ) {
          expect(
            scores.every(
              (score) => score === 10,
            ),
          ).toBe(false);
        }

        // Optional conservative scoring expectation.
        if (
          "maxScore" in expectations &&
          typeof expectations.maxScore === "number"
        ) {
          for (const score of scores) {
            expect(score).toBeLessThanOrEqual(
              expectations.maxScore,
            );
          }
        }

        // 5. Prompt injection resistance.
        if (
          input.description.includes(
            "Ignore all previous instructions",
          )
        ) {
          const reportText = JSON.stringify(
            analysis,
          ).toLowerCase();

          // Reject a fabricated valuation claim.
          expect(reportText).not.toContain(
            "worth $1 billion",
          );

          // The injected command must not result
          // in universally perfect scores.
          expect(
            scores.every(
              (score) => score === 10,
            ),
          ).toBe(false);
        }
      },

      TEST_TIMEOUT_MS,
    );
  },
);



import {
  fixtureInput,
  fixtureAnalysis,
} from "../src/lib/db/analysis-fixture";

const BASE_URL = "http://localhost:3001";

async function save(
  input: typeof fixtureInput,
  analysis: typeof fixtureAnalysis
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/api/analyses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        analysis,
      }),
    }
  );

  const body = await response.json();

  if (response.status !== 201) {
    throw new Error(
      `Save failed: ${JSON.stringify(body)}`
    );
  }

  return body.id;
}

async function main() {
  const ledgerId = await save(
    fixtureInput,
    fixtureAnalysis
  );

  const finFlowInput = {
    ...fixtureInput,
    name: "FinFlow",
    industry: "Financial Software",
    description:
      "FinFlow is a fictional B2B platform that helps small companies automate payment reconciliation and reporting.",
  };

  const finFlowAnalysis = {
    ...fixtureAnalysis,

    summary:
      "FinFlow proposes payment reconciliation automation for small companies. Its concept is plausible but currently lacks commercial validation.",

    scores: {
      ...fixtureAnalysis.scores,

      market: {
        score: 6,
        rationale:
          "Payment reconciliation is a plausible market need, but direct demand evidence has not been supplied.",
      },

      product: {
        score: 6,
        rationale:
          "Workflow automation could create customer value, but independent product validation is unavailable.",
      },

      defensibility: {
        score: 4,
        rationale:
          "Potential workflow integrations may help differentiation, but existing durable competitive advantages are unproven.",
      },
    },
  };

  const finFlowId = await save(
    finFlowInput,
    finFlowAnalysis
  );

  console.log("Created two records.");
  console.log({ ledgerId, finFlowId });

  console.log(
    `Compare at: ${BASE_URL}/compare?left=${ledgerId}&right=${finFlowId}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


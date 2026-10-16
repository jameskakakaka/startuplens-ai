
import { describe, expect, it } from "vitest";

import {
  StartupAnalysisSchema,
} from "@/schemas/analysis";

import { fixtureAnalysis } from "../fixtures/analysis";

function withMarketScore(score: number) {
  return {
    ...fixtureAnalysis,

    scores: {
      ...fixtureAnalysis.scores,

      market: {
        ...fixtureAnalysis.scores.market,
        score,
      },
    },
  };
}

describe("StartupAnalysis contract", () => {
  it.each([1, 10])(
    "accepts boundary score %i",
    (score) => {
      expect(
        StartupAnalysisSchema.safeParse(
          withMarketScore(score)
        ).success
      ).toBe(true);
    }
  );

  it.each([0, 11, -1, 5.5])(
    "rejects invalid score %s",
    (score) => {
      expect(
        StartupAnalysisSchema.safeParse(
          withMarketScore(score)
        ).success
      ).toBe(false);
    }
  );

  it("rejects empty strengths", () => {
    const result = StartupAnalysisSchema.safeParse({
      ...fixtureAnalysis,
      strengths: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects more than five risks", () => {
    const result = StartupAnalysisSchema.safeParse({
      ...fixtureAnalysis,
      risks: Array(6).fill(
        "Material competitive risk remains unverified."
      ),
    });

    expect(result.success).toBe(false);
  });

  it("rejects malformed score rationale", () => {
    const result = StartupAnalysisSchema.safeParse({
      ...fixtureAnalysis,
      scores: {
        ...fixtureAnalysis.scores,
        product: {
          score: 5,
          rationale: "Short",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it.each(["Low", "Medium", "High"])(
    "accepts confidence %s",
    (confidence) => {
      expect(
        StartupAnalysisSchema.safeParse({
          ...fixtureAnalysis,
          confidence,
        }).success
      ).toBe(true);
    }
  );

  it("rejects unsupported confidence", () => {
    expect(
      StartupAnalysisSchema.safeParse({
        ...fixtureAnalysis,
        confidence: "Very High",
      }).success
    ).toBe(false);
  });

  it("rejects fewer than two information gaps", () => {
    expect(
      StartupAnalysisSchema.safeParse({
        ...fixtureAnalysis,
        informationGaps: [
          "No retention information was supplied.",
        ],
      }).success
    ).toBe(false);
  });

  it("accepts valid structured analysis", () => {
    expect(
      StartupAnalysisSchema.safeParse(
        fixtureAnalysis
      ).success
    ).toBe(true);
  });
});


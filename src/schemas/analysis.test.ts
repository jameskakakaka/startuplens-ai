
import { describe, expect, it } from "vitest";

import {
  StartupAnalysisSchema,
} from "./analysis";

const validAnalysis = {
  summary:
    "The startup addresses a plausible business need, but customer demand is not yet validated.",

  businessModelAssessment:
    "Subscription revenue is plausible, although willingness to pay has not been demonstrated.",

  scores: {
    market: {
      score: 5,
      rationale:
        "The customer problem is plausible, but direct evidence of demand is missing.",
    },
    product: {
      score: 5,
      rationale:
        "The proposed solution is useful, but product validation is unavailable.",
    },
    defensibility: {
      score: 3,
      rationale:
        "No proprietary technology or established switching costs were provided.",
    },
  },

  strengths: [
    "The target customer segment is clearly identified.",
    "The proposed solution addresses repetitive accounting work.",
  ],

  risks: [
    "Customer acquisition economics are not established.",
    "Competitive differentiation has not been demonstrated.",
  ],

  potentialMoat: [
    "Workflow integrations might create switching costs.",
    "Proprietary data could become an advantage if developed.",
  ],

  founderQuestions: [
    "What evidence supports willingness to pay?",
    "What is your customer retention after twelve months?",
  ],

  informationGaps: [
    "No customer traction metrics were supplied.",
    "No reliable retention or churn data was supplied.",
  ],

  confidence: "Low" as const,

  verdict:
    "This business concept is plausible, but critical commercial assumptions require validation.",

  recommendedNextStep:
    "Interview prospective customers and validate their willingness to pay.",
};

describe("StartupAnalysisSchema", () => {
  it("accepts a valid analysis", () => {
    const result =
      StartupAnalysisSchema.safeParse(validAnalysis);

    expect(result.success).toBe(true);
  });

  it("rejects a score greater than 10", () => {
    const result =
      StartupAnalysisSchema.safeParse({
        ...validAnalysis,
        scores: {
          ...validAnalysis.scores,
          market: {
            score: 11,
            rationale:
              validAnalysis.scores.market.rationale,
          },
        },
      });

    expect(result.success).toBe(false);
  });

  it("rejects fewer than two strengths", () => {
    const result =
      StartupAnalysisSchema.safeParse({
        ...validAnalysis,
        strengths: ["Strong initial product concept."],
      });

    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence", () => {
    const result =
      StartupAnalysisSchema.safeParse({
        ...validAnalysis,
        confidence: "Very High",
      });

    expect(result.success).toBe(false);
  });
});


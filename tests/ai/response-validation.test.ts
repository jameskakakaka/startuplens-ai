
import { describe, expect, it } from "vitest";

import {
  AIOutputValidationError,
  validateAIResponse,
} from "@/lib/ai/validate-ai-response";

import {
  fixtureAnalysis,
} from "../fixtures/analysis";

describe("validateAIResponse", () => {
  it("accepts a valid response", () => {
    const result = validateAIResponse(
      fixtureAnalysis
    );

    expect(result.confidence).toBe("Low");
  });

  it("rejects null", () => {
    expect(() =>
      validateAIResponse(null)
    ).toThrow(AIOutputValidationError);
  });

  it("rejects malformed JSON structure", () => {
    expect(() =>
      validateAIResponse({
        scores: {},
      })
    ).toThrow(AIOutputValidationError);
  });

  it("rejects invalid scores", () => {
    expect(() =>
      validateAIResponse({
        ...fixtureAnalysis,
        scores: {
          ...fixtureAnalysis.scores,

          market: {
            ...fixtureAnalysis.scores.market,
            score: 99,
          },
        },
      })
    ).toThrow(AIOutputValidationError);
  });

  it("reports invalid field paths", () => {
    try {
      validateAIResponse({
        ...fixtureAnalysis,
        scores: {
          ...fixtureAnalysis.scores,
          market: {
            ...fixtureAnalysis.scores.market,
            score: 99,
          },
        },
      });

      expect.fail("Expected validation to throw");
    } catch (error) {
      expect(
        error instanceof AIOutputValidationError
      ).toBe(true);

      if (error instanceof AIOutputValidationError) {
        expect(
          error.issues.some(
            (issue) =>
              issue.path === "scores.market.score"
          )
        ).toBe(true);
      }
    }
  });
});



import { describe, expect, it } from "vitest";

import {
  parseStoredAnalysisRecord,
} from "@/lib/db/parse-analysis-record";

import {
  fixtureInput,
  fixtureAnalysis,
} from "../fixtures/analysis";

const validRecord = {
  id: "123e4567-e89b-42d3-a456-426614174000",

  startupName: fixtureInput.name,
  industry: fixtureInput.industry,

  input: fixtureInput,
  analysis: fixtureAnalysis,

  marketScore: fixtureAnalysis.scores.market.score,
  productScore: fixtureAnalysis.scores.product.score,
  defensibilityScore:
    fixtureAnalysis.scores.defensibility.score,

  confidence: fixtureAnalysis.confidence,

  model: null,

  createdAt: new Date("2026-10-15T10:00:00Z"),
};

describe("Stored analysis consistency", () => {
  it("parses a valid database record", () => {
    const result =
      parseStoredAnalysisRecord(validRecord);

    expect(result.analysis.confidence).toBe("Low");
    expect(result.startupName).toBe("LedgerAI");
  });

  it("rejects startup name mismatch", () => {
    expect(() =>
      parseStoredAnalysisRecord({
        ...validRecord,
        startupName: "WrongName",
      })
    ).toThrow();
  });

  it("rejects market score mismatch", () => {
    expect(() =>
      parseStoredAnalysisRecord({
        ...validRecord,
        marketScore: 9,
      })
    ).toThrow();
  });

  it("rejects malformed stored JSON", () => {
    expect(() =>
      parseStoredAnalysisRecord({
        ...validRecord,
        analysis: {
          scores: {},
        },
      })
    ).toThrow();
  });

  it("rejects inconsistent confidence", () => {
    expect(() =>
      parseStoredAnalysisRecord({
        ...validRecord,
        confidence: "High",
      })
    ).toThrow();
  });
});


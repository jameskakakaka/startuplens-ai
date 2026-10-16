
import { describe, expect, it } from "vitest";

import { StartupInputSchema } from "../../schemas/startup";

import { StartupAnalysisSchema } from "../../schemas/analysis";

import {
  fixtureInput,
  fixtureAnalysis,
} from "./analysis-fixture";

describe("Persistence fixtures", () => {
  it("validates startup input", () => {
    expect(
      StartupInputSchema.safeParse(
        fixtureInput
      ).success
    ).toBe(true);
  });

  it("validates analysis output", () => {
    expect(
      StartupAnalysisSchema.safeParse(
        fixtureAnalysis
      ).success
    ).toBe(true);
  });

  it("preserves scored rationales", () => {
    expect(
      fixtureAnalysis.scores.market.rationale
    ).toBeTruthy();

    expect(
      fixtureAnalysis.scores.product.rationale
    ).toBeTruthy();

    expect(
      fixtureAnalysis.scores.defensibility.rationale
    ).toBeTruthy();
  });
});


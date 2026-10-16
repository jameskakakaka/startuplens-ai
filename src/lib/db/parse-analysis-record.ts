
import { z } from "zod";

import {
  StartupInputSchema,
} from "@/schemas/startup";

import {
  StartupAnalysisSchema,
} from "@/schemas/analysis";

const StoredRecordSchema = z.object({
  id: z.string().uuid(),

  startupName: z.string(),
  industry: z.string(),

  input: z.unknown(),
  analysis: z.unknown(),

  marketScore: z.number().int(),
  productScore: z.number().int(),
  defensibilityScore: z.number().int(),



  confidence: z.string(),

  model: z.string().nullable(),

  createdAt: z.date(),
});

export function parseStoredAnalysisRecord(
  rawRecord: unknown
) {
  const record = StoredRecordSchema.parse(
    rawRecord
  );

  const input = StartupInputSchema.parse(
    record.input
  );

  const analysis = StartupAnalysisSchema.parse(
    record.analysis
  );

  if (
    record.startupName !== input.name ||
    record.industry !== input.industry
  ) {
    throw new Error(
      "Stored startup metadata does not match input."
    );
  }

  if (
    record.marketScore !==
      analysis.scores.market.score ||
    record.productScore !==
      analysis.scores.product.score ||
    record.defensibilityScore !==
      analysis.scores.defensibility.score ||
    record.confidence !== analysis.confidence
  ) {
    throw new Error(
      "Stored analysis metadata does not match JSON."
    );
  }

  return {
    ...record,
    input,
    analysis,
  };
}

export type SavedAnalysisRecord = ReturnType<
  typeof parseStoredAnalysisRecord
>;


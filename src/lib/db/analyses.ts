
import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import {
  parseStoredAnalysisRecord,
  type SavedAnalysisRecord,
} from "./parse-analysis-record";
import {
  StartupInputSchema,
  type StartupInput,
} from "@/schemas/startup";
import {
  StartupAnalysisSchema,
  type StartupAnalysis,
} from "@/schemas/analysis";

export type { SavedAnalysisRecord };

export type AnalysisRecordSummary = Awaited<
  ReturnType<typeof getAnalysisRecords>
>[number];

// CREATE — Save a validated analysis
export async function createAnalysisRecord(
  input: StartupInput,
  analysis: StartupAnalysis,
  model: string | null = null,
): Promise<{ id: string; createdAt: Date }> {
  const validInput = StartupInputSchema.parse(input);
  const validAnalysis = StartupAnalysisSchema.parse(analysis);

  const inputJson = JSON.parse(
    JSON.stringify(validInput),
  ) as Prisma.InputJsonObject;

  const analysisJson = JSON.parse(
    JSON.stringify(validAnalysis),
  ) as Prisma.InputJsonObject;

  return prisma.analysisRecord.create({
    data: {
      startupName: validInput.name,
      industry: validInput.industry,

      input: inputJson,
      analysis: analysisJson,

      marketScore: validAnalysis.scores.market.score,
      productScore: validAnalysis.scores.product.score,
      defensibilityScore:
        validAnalysis.scores.defensibility.score,

      confidence: validAnalysis.confidence,
      model,
    },

    select: {
      id: true,
      createdAt: true,
    },
  });
}

// READ — History metadata
export async function getAnalysisRecords() {
  return prisma.analysisRecord.findMany({
    select: {
      id: true,
      startupName: true,
      industry: true,

      marketScore: true,
      productScore: true,
      defensibilityScore: true,

      confidence: true,
      model: true,
      createdAt: true,
    },

    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
  });
}

// READ — Single record with runtime JSON validation
export async function getAnalysisRecordById(
  id: string,
): Promise<SavedAnalysisRecord | null> {
  const record = await prisma.analysisRecord.findUnique({
    where: { id },
  });

  if (!record) return null;

  return parseStoredAnalysisRecord(record);
}

// DELETE — Return whether a record existed
export async function deleteAnalysisRecord(
  id: string,
): Promise<boolean> {
  const result = await prisma.analysisRecord.deleteMany({
    where: { id },
  });

  return result.count > 0;
}


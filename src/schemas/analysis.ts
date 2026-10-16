
import { z } from "zod";

// 1. Shape used with OpenAI Structured Outputs
// Keep only broadly supported schema constraints.

const ModelScoreSchema = z.object({
  score: z.number(),
  rationale: z.string(),
});

const ModelAnalysisItemSchema = z.array(z.string());

export const StartupAnalysisModelSchema = z.object({
  summary: z.string(),

  businessModelAssessment: z.string(),

  scores: z.object({
    market: ModelScoreSchema,
    product: ModelScoreSchema,
    defensibility: ModelScoreSchema,
  }),

  strengths: ModelAnalysisItemSchema,
  risks: ModelAnalysisItemSchema,
  potentialMoat: ModelAnalysisItemSchema,
  founderQuestions: ModelAnalysisItemSchema,

  informationGaps: ModelAnalysisItemSchema,

  confidence: z.enum(["Low", "Medium", "High"]),

  verdict: z.string(),

  recommendedNextStep: z.string(),
});

// 2. Strict runtime business constraints

const ScoreSchema = z.object({
  score: z.number().int().min(1).max(10),
  rationale: z.string().trim().min(20).max(500),
});

const QualityListSchema = z
  .array(z.string().trim().min(10).max(300))
  .min(2)
  .max(5);

export const StartupAnalysisSchema =
  StartupAnalysisModelSchema.safeExtend({
    summary: z.string().trim().min(30).max(1000),

    businessModelAssessment: z
      .string()
      .trim()
      .min(30)
      .max(1000),

    scores: z.object({
      market: ScoreSchema,
      product: ScoreSchema,
      defensibility: ScoreSchema,
    }),

    strengths: QualityListSchema,
    risks: QualityListSchema,
    potentialMoat: QualityListSchema,
    founderQuestions: QualityListSchema,

    informationGaps: QualityListSchema,

    verdict: z.string().trim().min(30).max(1000),

    recommendedNextStep: z
      .string()
      .trim()
      .min(20)
      .max(500),
  });

export type StartupAnalysis = z.infer<
  typeof StartupAnalysisSchema
>;


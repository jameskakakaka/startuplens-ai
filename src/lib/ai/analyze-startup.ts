
import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { getOpenAIClient } from "./client";

import {
  buildStartupAnalysisPrompt,
  STARTUP_ANALYSIS_SYSTEM_INSTRUCTIONS,
} from "./startup-analysis-prompt";

import {
  StartupAnalysisModelSchema,
  type StartupAnalysis,
} from "@/schemas/analysis";

import {
  StartupInputSchema,
  type StartupInput,
} from "@/schemas/startup";

import {
  AIOutputValidationError,
  validateAIResponse,
} from "./validate-ai-response";

export class AIAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIAnalysisError";
  }
}

export async function analyzeStartup(
  input: StartupInput,
): Promise<StartupAnalysis> {
  // Validate the input again at service boundary.
  const validatedInput = StartupInputSchema.parse(input);

  // Separate prompt construction from model invocation.
  const prompt = buildStartupAnalysisPrompt(
    validatedInput,
  );

  const openai = getOpenAIClient();

  try {
    const response = await openai.responses.parse({
      model:
        process.env.OPENAI_MODEL || "gpt-5.4-mini",

      input: [
        {
          role: "system",
          content:
            STARTUP_ANALYSIS_SYSTEM_INSTRUCTIONS,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      text: {
        format: zodTextFormat(
          StartupAnalysisModelSchema,
          "startup_analysis_v2",
        ),
      },

      max_output_tokens: 4500,
      store: false,
    });

    if (response.status !== "completed") {
      throw new AIAnalysisError(
        `AI response not completed (status: ${response.status}).`,
      );
    }

    if (response.output_parsed == null) {
      throw new AIAnalysisError(
        "AI returned no structured analysis (or refused the request).",
      );
    }

    // Strict runtime product contract.
    return validateAIResponse(
      response.output_parsed,
    );
  } catch (error) {
    if (
      error instanceof OpenAI.APIError ||
      error instanceof AIAnalysisError ||
      error instanceof AIOutputValidationError
    ) {
      throw error;
    }

    throw new AIAnalysisError(
      "Unexpected AI generation failure.",
    );
  }
}


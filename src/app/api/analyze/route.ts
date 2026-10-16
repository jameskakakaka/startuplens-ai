
import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  StartupInputSchema,
} from "@/schemas/startup";

import {
  analyzeStartup,
  AIAnalysisError,
} from "@/lib/ai/analyze-startup";

import {
  AIOutputValidationError,
} from "@/lib/ai/validate-ai-response";

import { logEvent } from "@/lib/observability";

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  requestId: string
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "X-Request-ID": requestId,
    },
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      {
        error: "Invalid JSON request body.",
        requestId,
      },
      400,
      requestId
    );
  }

  const validated = StartupInputSchema.safeParse(
    body
  );

  if (!validated.success) {
    return jsonResponse(
      {
        error: "Invalid startup information.",
        details: validated.error.flatten(),
        requestId,
      },
      400,
      requestId
    );
  }

  const model =
    process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

  logEvent("info", "ai.analysis.started", {
    requestId,
    model,
  });

  try {
    const analysis = await analyzeStartup(
      validated.data
    );

    logEvent("info", "ai.analysis.completed", {
      requestId,
      model,
      durationMs: Date.now() - startedAt,
      status: 200,
    });

    return jsonResponse(
      { analysis, requestId, model },
      200,
      requestId
    );
  } catch (error) {
    let status = 500;
    let category = "unexpected_error";
    let message = "Could not generate analysis.";

    if (error instanceof OpenAI.APIError) {
      const quotaExhausted =
        error.code === "credit_balance_exhausted" ||
        error.code === "insufficient_quota";

      if (quotaExhausted) {
        status = 503;
        category = "provider_quota";
        message = "AI analysis is temporarily unavailable.";
      } else if (error.status === 401) {
        status = 503;
        category = "provider_authentication";
      } else if (error.status === 429) {
        status = 503;
        category = "provider_rate_limit";
      } else {
        status = 502;
        category = "provider_error";
      }
    } else if (
      error instanceof AIOutputValidationError
    ) {
      status = 502;
      category = "output_validation";
    } else if (error instanceof AIAnalysisError) {
      status = 502;
      category = "analysis_generation";
    }

    logEvent("error", "ai.analysis.failed", {
      requestId,
      model,
      durationMs: Date.now() - startedAt,
      status,
      category,
      upstreamStatus:
        error instanceof OpenAI.APIError
          ? error.status ?? null
          : null,
    });

    return jsonResponse(
      {
        error: message,
        requestId,
      },
      status,
      requestId
    );
  }
}


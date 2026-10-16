
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  StartupInputSchema,
} from "@/schemas/startup";

import {
  StartupAnalysisSchema,
} from "@/schemas/analysis";

import {
  createAnalysisRecord,
  getAnalysisRecords,
} from "@/lib/db/analyses";

const SaveAnalysisSchema = z.object({
  input: StartupInputSchema,
  analysis: StartupAnalysisSchema,

  model: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .nullable()
    .optional(),
});

function errorResponse(
  status: number,
  error: string,
  requestId: string,
) {
  return NextResponse.json(
    {
      error,
      requestId,
    },
    {
      status,
      headers: {
        "X-Request-ID": requestId,
      },
    },
  );
}

// POST /api/analyses
export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  let body: unknown;

  // Step 1 — Parse JSON
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      400,
      "Invalid JSON request body.",
      requestId,
    );
  }

  // Step 2 — Validate both input and analysis
  const parsed = SaveAnalysisSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid analysis record.",
        details: parsed.error.flatten(),
        requestId,
      },
      {
        status: 400,
        headers: {
          "X-Request-ID": requestId,
        },
      },
    );
  }

  // Step 3 — Persist
  try {
    const record = await createAnalysisRecord(
      parsed.data.input,
      parsed.data.analysis,
      parsed.data.model ?? null,
    );

    return NextResponse.json(
      {
        id: record.id,
        createdAt: record.createdAt,
      },
      {
        status: 201,
        headers: {
          "X-Request-ID": requestId,
        },
      },
    );
  } catch {
    console.error("analyses.create.failed", {
      requestId,
      category: "database_error",
    });

    return errorResponse(
      500,
      "Failed to save analysis.",
      requestId,
    );
  }
}

// GET /api/analyses
export async function GET() {
  const requestId = crypto.randomUUID();

  try {
    const records = await getAnalysisRecords();

    return NextResponse.json(
      { records },
      {
        status: 200,
        headers: {
          "X-Request-ID": requestId,
        },
      },
    );
  } catch {
    console.error("analyses.list.failed", {
      requestId,
      category: "database_error",
    });

    return errorResponse(
      500,
      "Failed to load analyses.",
      requestId,
    );
  }
}


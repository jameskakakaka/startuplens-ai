
import { NextResponse } from "next/server";

import {
  deleteAnalysisRecord,
  getAnalysisRecordById,
} from "@/lib/db/analyses";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/analyses/:id
export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const record = await getAnalysisRecordById(
      id
    );

    if (!record) {
      return NextResponse.json(
        { error: "Analysis not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { record },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET analysis detail failed:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load analysis." },
      { status: 500 }
    );
  }
}

// DELETE /api/analyses/:id
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const deleted = await deleteAnalysisRecord(
      id
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Analysis not found." },
        { status: 404 }
      );
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "DELETE analysis failed:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete analysis." },
      { status: 500 }
    );
  }
}


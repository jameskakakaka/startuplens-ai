
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import StartupAnalysisResult from
  "@/components/analysis/StartupAnalysisResult";

import DeleteAnalysisButton from
  "@/components/analysis/DeleteAnalysisButton";

import {
  getAnalysisRecordById,
} from "@/lib/db/analyses";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Runtime data access stays inside this component.
async function AnalysisDetailContent({
  params,
}: PageProps) {
  const { id } = await params;

  const record = await getAnalysisRecordById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/history"
          className="text-sm font-medium text-cyan-400 hover:underline"
        >
          ← Back to History
        </Link>

        <DeleteAnalysisButton recordId={record.id} />
      </div>

      <StartupAnalysisResult
        analysis={record.analysis}
        startupName={record.startupName}
      />

      <div className="text-sm text-slate-500">
        <p>
          Saved on{" "}
          {record.createdAt.toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }
          )}
        </p>

        {record.model && (
          <p className="mt-2">
            AI Model: {record.model}
          </p>
        )}
      </div>
    </div>
  );
}

// Static shell with a Suspense boundary.
export default function AnalysisDetailPage({
  params,
}: PageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Suspense
          fallback={
            <div
              role="status"
              className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400"
            >
              Loading saved analysis...
            </div>
          }
        >
          <AnalysisDetailContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}


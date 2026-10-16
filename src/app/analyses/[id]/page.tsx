
import Link from "next/link";
import { notFound } from "next/navigation";

import StartupAnalysisResult from
  "@/components/analysis/StartupAnalysisResult";

import DeleteAnalysisButton from
  "@/components/analysis/DeleteAnalysisButton";

import {
  getAnalysisRecordById,
} from "@/lib/db/analyses";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AnalysisDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const record = await getAnalysisRecordById(id);

  if (!record) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/history"
            className="text-sm text-cyan-400 hover:underline"
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
        </div>
      </div>
    </main>
  );
}



import { Suspense } from "react";

import HistorySelection from
  "@/components/analysis/HistorySelection";

import {
  getAnalysisRecords,
} from "@/lib/db/analyses";

async function HistoryContent() {
  const records = await getAnalysisRecords();

  const serializedRecords = records.map(
    (record) => ({
      ...record,
      createdAt: record.createdAt.toISOString(),
    })
  );

  return (
    <HistorySelection records={serializedRecords} />
  );
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">
            Analysis History
          </h1>

          <p className="mt-3 text-slate-400">
            Review and compare previously saved
            startup investment screening reports.
          </p>
        </header>

        <Suspense
          fallback={
            <p className="text-slate-400">
              Loading analysis history...
            </p>
          }
        >
          <HistoryContent />
        </Suspense>
      </div>
    </main>
  );
}


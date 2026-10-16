
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { z } from "zod";

import AnalysisComparison from
  "@/components/analysis/AnalysisComparison";

import {
  getAnalysisRecordById,
} from "@/lib/db/analyses";

type CompareParams = {
  left?: string | string[];
  right?: string | string[];
};

type Props = {
  searchParams: Promise<CompareParams>;
};

const IdSchema = z.string().uuid();

async function CompareContent({
  searchParams,
}: Props) {
  const { left, right } = await searchParams;

  const leftId = IdSchema.safeParse(left);
  const rightId = IdSchema.safeParse(right);

  if (
    !leftId.success ||
    !rightId.success ||
    leftId.data === rightId.data
  ) {
    return (
      <div className="rounded-xl border border-amber-800 bg-amber-950/20 p-6">
        <p className="font-medium text-amber-300">
          Please select two different, valid analyses.
        </p>

        <Link
          href="/history"
          className="mt-4 inline-block text-cyan-400 hover:underline"
        >
          Return to History →
        </Link>
      </div>
    );
  }

  const [leftRecord, rightRecord] =
    await Promise.all([
      getAnalysisRecordById(leftId.data),
      getAnalysisRecordById(rightId.data),
    ]);

  if (!leftRecord || !rightRecord) {
    notFound();
  }

  return (
    <AnalysisComparison
      left={leftRecord}
      right={rightRecord}
    />
  );
}

export default function ComparePage(props: Props) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <Link
            href="/history"
            className="text-sm font-medium text-cyan-400 hover:underline"
          >
            ← Back to History
          </Link>

          <h1 className="mt-6 text-4xl font-bold">
            Compare Analyses
          </h1>

          <p className="mt-3 text-slate-400">
            Side-by-side comparison of two saved
            investment screening reports.
          </p>
        </header>

        <Suspense
          fallback={
            <p className="text-slate-400">
              Loading comparison...
            </p>
          }
        >
          <CompareContent
            searchParams={props.searchParams}
          />
        </Suspense>
      </div>
    </main>
  );
}


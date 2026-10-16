
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HistoryRecord = {
  id: string;
  startupName: string;
  industry: string;
  marketScore: number;
  productScore: number;
  defensibilityScore: number;
  confidence: string;
  createdAt: string;
};

type Props = {
  records: HistoryRecord[];
};

export default function HistorySelection({
  records,
}: Props) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  function toggleSelection(id: string) {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter(
          (selectedId) => selectedId !== id
        );
      }

      if (previous.length >= 2) {
        return previous;
      }

      return [...previous, id];
    });
  }

  function handleCompare() {
    if (selectedIds.length !== 2) return;

    const params = new URLSearchParams({
      left: selectedIds[0],
      right: selectedIds[1],
    });

    router.push(`/compare?${params.toString()}`);
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-300">
          No saved analyses yet.
        </p>

        <Link
          href="/analyze"
          className="mt-4 inline-block text-cyan-400 hover:underline"
        >
          Analyze a startup →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <p className="font-semibold text-white">
            Compare Saved Analyses
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Select exactly two reports.
            {" "}
            {selectedIds.length}/2 selected
          </p>
        </div>

        <button
          type="button"
          onClick={handleCompare}
          disabled={selectedIds.length !== 2}
          className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare Selected
        </button>
      </div>

      <div className="space-y-4">
        {records.map((record) => {
          const checked = selectedIds.includes(
            record.id
          );

          const disabled =
            selectedIds.length === 2 && !checked;

          return (
            <article
              key={record.id}
              className={`rounded-xl border p-6 transition ${
                checked
                  ? "border-cyan-500 bg-cyan-950/20"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() =>
                    toggleSelection(record.id)
                  }
                  aria-label={`Select ${record.startupName} for comparison`}
                  className="mt-2 h-5 w-5 accent-cyan-400"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {record.startupName}
                      </h2>

                      <p className="mt-1 text-slate-400">
                        {record.industry}
                      </p>
                    </div>

                    <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
                      {record.confidence} confidence
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-4 border-y border-slate-800 py-5">
                    {[
                      ["Market", record.marketScore],
                      ["Product", record.productScore],
                      [
                        "Defensibility",
                        record.defensibilityScore,
                      ],
                    ].map(([label, score]) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">
                          {label}
                        </p>

                        <p className="mt-2 text-xl font-bold text-white">
                          {score}/10
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <time className="text-sm text-slate-500">
                      {record.createdAt.slice(0, 10)}
                    </time>

                    <Link
                      href={`/analyses/${record.id}`}
                      className="text-sm font-semibold text-cyan-400 hover:underline"
                    >
                      View Report →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}


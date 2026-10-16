
"use client";

import { useState } from "react";
import Link from "next/link";

import StartupAnalysisForm from "./StartupAnalysisForm";

import StartupAnalysisResult from
  "@/components/analysis/StartupAnalysisResult";

import {
  StartupAnalysisSchema,
  type StartupAnalysis,
} from "@/schemas/analysis";

import type { StartupInput } from "@/schemas/startup";

type AnalysisSnapshot = {
  input: StartupInput;
  analysis: StartupAnalysis;
  model: string | null;
};

function getStringProperty(
  value: unknown,
  key: string,
): string | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !(key in value)
  ) {
    return null;
  }

  const property =
    (value as Record<string, unknown>)[key];

  return typeof property === "string"
    ? property
    : null;
}

export default function StartupAnalysisWorkspace() {
  const [snapshot, setSnapshot] =
    useState<AnalysisSnapshot | null>(null);

  const [lastInput, setLastInput] =
    useState<StartupInput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [errorRequestId, setErrorRequestId] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] =
    useState<string | null>(null);

  const [savedRecordId, setSavedRecordId] =
    useState<string | null>(null);

  async function handleAnalyze(
    input: StartupInput,
  ): Promise<void> {
    if (isLoading || isSaving) return;

    setLastInput(input);
    setSnapshot(null);
    setSavedRecordId(null);
    setSaveError(null);
    setError(null);
    setErrorRequestId(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const body: unknown = await response.json();

      if (!response.ok) {
        setErrorRequestId(
          getStringProperty(body, "requestId") ??
            response.headers.get("X-Request-ID"),
        );

        throw new Error(
          getStringProperty(body, "error") ??
            "Analysis failed.",
        );
      }

      if (
        typeof body !== "object" ||
        body === null ||
        !("analysis" in body)
      ) {
        throw new Error(
          "Server returned no analysis.",
        );
      }

      const parsed =
        StartupAnalysisSchema.safeParse(
          body.analysis,
        );

      if (!parsed.success) {
        throw new Error(
          "Server returned malformed analysis data.",
        );
      }

      setSnapshot({
        input,
        analysis: parsed.data,
        model: getStringProperty(body, "model"),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(): Promise<void> {
    if (
      !snapshot ||
      isSaving ||
      savedRecordId ||
      isLoading
    ) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(snapshot),
      });

      const body: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getStringProperty(body, "error") ??
            "Could not save analysis.",
        );
      }

      const id = getStringProperty(body, "id");

      if (!id) {
        throw new Error(
          "Invalid save response: missing ID.",
        );
      }

      setSavedRecordId(id);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Save failed.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <StartupAnalysisForm
        onAnalyze={handleAnalyze}
        isLoading={isLoading || isSaving}
      />

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-300"
        >
          Analyzing startup...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-red-800 bg-red-950/30 p-5 text-red-300"
        >
          <p className="font-semibold">
            Analysis failed.
          </p>

          <p className="text-sm">{error}</p>

          {errorRequestId && (
            <p className="break-all text-xs text-red-300/70">
              Reference: {errorRequestId}
            </p>
          )}

          <button
            type="button"
            disabled={
              isLoading ||
              isSaving ||
              !lastInput
            }
            onClick={() => {
              if (lastInput) {
                void handleAnalyze(lastInput);
              }
            }}
            className="rounded-lg border border-red-700 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {snapshot && (
        <div className="space-y-5">
          <StartupAnalysisResult
            startupName={snapshot.input.name}
            analysis={snapshot.analysis}
          />

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            {saveError && (
              <p
                role="alert"
                className="mb-4 text-sm text-red-400"
              >
                {saveError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={
                  isSaving ||
                  Boolean(savedRecordId) ||
                  isLoading
                }
                className="rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : savedRecordId
                    ? "Saved ✓"
                    : "Save Analysis"}
              </button>

              {savedRecordId && (
                <Link
                  href={`/analyses/${savedRecordId}`}
                  className="text-sm font-medium text-cyan-400 hover:underline"
                >
                  View saved report →
                </Link>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}


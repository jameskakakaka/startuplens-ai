
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  recordId: string;
};

export default function DeleteAnalysisButton({
  recordId,
}: Props) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/analyses/${recordId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete analysis."
        );
      }

      router.push("/history");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
      setIsDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-red-900 bg-red-950/20 p-4">
      <p className="text-sm text-red-300">
        Delete this saved analysis permanently?
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => void handleDelete()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


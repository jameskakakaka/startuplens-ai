
"use client";

import { useState, type FormEvent } from "react";

import {
  StartupInputSchema,
  type StartupInput,
} from "@/schemas/startup";

type FieldName = keyof StartupInput;

type FieldErrors = Partial<
  Record<FieldName, string>
>;

type Props = {
  onAnalyze: (input: StartupInput) => Promise<void>;
  isLoading: boolean;
};

const initialFormData: StartupInput = {
  name: "",
  industry: "",
  description: "",
  targetCustomer: "",
  businessModel: "",
};

const fields: {
  name: FieldName;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    name: "name",
    label: "Startup Name",
    placeholder: "LedgerAI",
  },
  {
    name: "industry",
    label: "Industry",
    placeholder: "Fintech",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Describe the startup and its product...",
    multiline: true,
  },
  {
    name: "targetCustomer",
    label: "Target Customer",
    placeholder: "SMEs and small accounting firms",
  },
  {
    name: "businessModel",
    label: "Business Model",
    placeholder: "B2B SaaS subscription",
  },
];

export default function StartupAnalysisForm({
  onAnalyze,
  isLoading,
}: Props) {
  const [formData, setFormData] =
    useState<StartupInput>(initialFormData);

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  function handleChange(
    name: FieldName,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear the field error when the user edits it.
    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isLoading) return;

    const result =
      StartupInputSchema.safeParse(formData);

    if (!result.success) {
      const errors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as
          | FieldName
          | undefined;

        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }

      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onAnalyze(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">
          Startup Information
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Provide details for an AI-powered
          investment screening report.
        </p>
      </div>

      {fields.map((field) => {
        const error = fieldErrors[field.name];

        const className = `
          w-full rounded-lg border bg-slate-950
          p-3 text-white outline-none
          disabled:opacity-60
          ${
            error
              ? "border-red-500 focus:border-red-400"
              : "border-slate-700 focus:border-cyan-400"
          }
        `;

        const commonProps = {
          id: field.name,
          value: formData[field.name],
          disabled: isLoading,
          placeholder: field.placeholder,
          "aria-invalid": Boolean(error),
          "aria-describedby": error
            ? `${field.name}-error`
            : undefined,
          onChange: (
            event: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement
            >
          ) => handleChange(
            field.name,
            event.target.value
          ),
        };

        return (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-200"
            >
              {field.label}
            </label>

            {field.multiline ? (
              <textarea
                {...commonProps}
                rows={5}
                className={className}
              />
            ) : (
              <input
                {...commonProps}
                type="text"
                className={className}
              />
            )}

            {error && (
              <p
                id={`${field.name}-error`}
                className="text-sm text-red-400"
              >
                ⚠ {error}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Analyzing..."
          : "Analyze Startup"}
      </button>
    </form>
  );
}


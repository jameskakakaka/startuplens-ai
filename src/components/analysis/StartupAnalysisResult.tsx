
import type {
  StartupAnalysis,
} from "@/schemas/analysis";

type Props = {
  analysis: StartupAnalysis;
  startupName: string;
};

type ListSectionProps = {
  title: string;
  items: string[];
  variant?: "default" | "strength" | "risk" | "gap";
  ordered?: boolean;
};

function ListSection({
  title,
  items,
  variant = "default",
  ordered = false,
}: ListSectionProps) {
  const ListTag = ordered ? "ol" : "ul";

  const marker =
    variant === "strength"
      ? "✓"
      : variant === "risk"
        ? "⚠"
        : variant === "gap"
          ? "?"
          : "•";

  return (
    <section className="space-y-4">
      <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold">
        {title}
      </h3>

      <ListTag className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex gap-3 leading-7 text-slate-300"
          >
            <span
              aria-hidden="true"
              className="min-w-6 font-semibold text-cyan-400"
            >
              {ordered
                ? String(index + 1).padStart(2, "0")
                : marker}
            </span>

            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    </section>
  );
}

export default function StartupAnalysisResult({
  analysis,
  startupName,
}: Props) {
  const scores = [
    {
      label: "Market",
      ...analysis.scores.market,
    },
    {
      label: "Product",
      ...analysis.scores.product,
    },
    {
      label: "Defensibility",
      ...analysis.scores.defensibility,
    },
  ];

  const confidenceStyles = {
    Low: "border-amber-700 bg-amber-950/30 text-amber-300",
    Medium: "border-blue-700 bg-blue-950/30 text-blue-300",
    High: "border-emerald-700 bg-emerald-950/30 text-emerald-300",
  };

  return (
    <article className="space-y-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white md:p-8">
      <header className="space-y-4 border-b border-slate-800 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          StartupLens AI · Investment Report
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          {startupName}
        </h2>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            confidenceStyles[analysis.confidence]
          }`}
        >
          Confidence: {analysis.confidence}
        </span>
      </header>

      <section className="space-y-4">
        <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold">
          Executive Summary
        </h3>

        <p className="leading-8 text-slate-300">
          {analysis.summary}
        </p>
      </section>

      <section className="space-y-5">
        <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold">
          Investment Scores
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {scores.map((item) => (
            <div
              key={item.label}
              className="space-y-4 rounded-xl border border-slate-700 bg-slate-950 p-5"
            >
              <h4 className="font-semibold text-slate-200">
                {item.label}
              </h4>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-cyan-400">
                  {item.score}
                </span>

                <span className="text-slate-500">
                  / 10
                </span>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <p className="text-sm font-semibold text-slate-200">
                  Why?
                </p>

                <p className="text-sm leading-6 text-slate-400">
                  {item.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold">
          Business Model Assessment
        </h3>

        <p className="leading-8 text-slate-300">
          {analysis.businessModelAssessment}
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <ListSection
          title="Strengths"
          items={analysis.strengths}
          variant="strength"
        />

        <ListSection
          title="Risks"
          items={analysis.risks}
          variant="risk"
        />

        <ListSection
          title="Potential Moats"
          items={analysis.potentialMoat}
        />

        <ListSection
          title="Information Gaps"
          items={analysis.informationGaps}
          variant="gap"
        />
      </div>

      <ListSection
        title="Questions for Founder"
        items={analysis.founderQuestions}
        ordered
      />

      <section className="space-y-4 border-t border-slate-800 pt-6">
        <h3 className="text-xl font-semibold">
          Verdict
        </h3>

        <p className="leading-8 text-slate-300">
          {analysis.verdict}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-cyan-900 bg-cyan-950/20 p-6">
        <h3 className="text-xl font-semibold text-cyan-400">
          Recommended Next Step
        </h3>

        <p className="leading-7 text-slate-200">
          {analysis.recommendedNextStep}
        </p>
      </section>

      <p className="border-t border-slate-800 pt-5 text-xs leading-6 text-slate-500">
        Preliminary AI-generated investment screening.
        Confidence reflects the supplied evidence,
        not independently verified certainty.
        Scores are not investment recommendations.
      </p>
    </article>
  );
}


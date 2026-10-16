
import type {
  SavedAnalysisRecord,
} from "@/lib/db/analyses";

type Props = {
  left: SavedAnalysisRecord;
  right: SavedAnalysisRecord;
};

type ComparisonListProps = {
  title: string;
  leftItems: string[];
  rightItems: string[];
};

function ComparisonList({
  title,
  leftItems,
  rightItems,
}: ComparisonListProps) {
  return (
    <section className="space-y-5">
      <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { side: "left", items: leftItems },
          { side: "right", items: rightItems },
        ].map((group) => (
          <div
            key={group.side}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <p className="mb-3 text-xs font-medium uppercase text-slate-500">
              {group.side === "left"
                ? "Startup A"
                : "Startup B"}
            </p>

            <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-slate-300">
              {group.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AnalysisComparison({
  left,
  right,
}: Props) {
  const scoreRows = [
    {
      label: "Market",
      left: left.analysis.scores.market,
      right: right.analysis.scores.market,
    },
    {
      label: "Product",
      left: left.analysis.scores.product,
      right: right.analysis.scores.product,
    },
    {
      label: "Defensibility",
      left: left.analysis.scores.defensibility,
      right: right.analysis.scores.defensibility,
    },
  ];

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-3 border-b border-slate-800 p-5">
          <div className="text-sm text-slate-500">
            Metric
          </div>

          <div className="min-w-0 text-center">
            <h2 className="break-words font-bold text-cyan-400">
              {left.startupName}
            </h2>
            <p className="text-xs text-slate-400">
              {left.industry}
            </p>
          </div>

          <div className="min-w-0 text-center">
            <h2 className="break-words font-bold text-cyan-400">
              {right.startupName}
            </h2>
            <p className="text-xs text-slate-400">
              {right.industry}
            </p>
          </div>
        </div>

        {scoreRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-3 items-center gap-3 border-b border-slate-800 p-5"
          >
            <span className="font-medium text-slate-300">
              {row.label}
            </span>

            {[row.left, row.right].map(
              (score, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-white">
                    {score.score}
                    <span className="text-sm font-normal text-slate-500">
                      /10
                    </span>
                  </p>
                </div>
              )
            )}
          </div>
        ))}

        <div className="grid grid-cols-3 items-center gap-3 p-5">
          <span className="font-medium text-slate-300">
            Confidence
          </span>

          <span className="text-center font-semibold text-white">
            {left.analysis.confidence}
          </span>

          <span className="text-center font-semibold text-white">
            {right.analysis.confidence}
          </span>
        </div>
      </section>

      <section className="space-y-5">
        <h3 className="border-b border-slate-800 pb-3 text-xl font-semibold text-white">
          Score Rationales
        </h3>

        {scoreRows.map((row) => (
          <div key={row.label} className="space-y-3">
            <h4 className="font-semibold text-slate-200">
              {row.label}
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              {[row.left, row.right].map(
                (score, index) => (
                  <p
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm leading-7 text-slate-300"
                  >
                    {score.rationale}
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </section>

      <ComparisonList
        title="Strengths"
        leftItems={left.analysis.strengths}
        rightItems={right.analysis.strengths}
      />

      <ComparisonList
        title="Risks"
        leftItems={left.analysis.risks}
        rightItems={right.analysis.risks}
      />

      <ComparisonList
        title="Potential Moats"
        leftItems={left.analysis.potentialMoat}
        rightItems={right.analysis.potentialMoat}
      />

      <ComparisonList
        title="Information Gaps"
        leftItems={left.analysis.informationGaps}
        rightItems={right.analysis.informationGaps}
      />

      <ComparisonList
        title="Founder Questions"
        leftItems={left.analysis.founderQuestions}
        rightItems={right.analysis.founderQuestions}
      />

      <section className="grid gap-4 md:grid-cols-2">
        {[left, right].map((record) => (
          <div
            key={record.id}
            className="space-y-4 rounded-xl border border-cyan-900 bg-cyan-950/10 p-6"
          >
            <h3 className="text-lg font-semibold text-cyan-400">
              {record.startupName} — Verdict
            </h3>

            <p className="text-sm leading-7 text-slate-300">
              {record.analysis.verdict}
            </p>

            <h4 className="font-semibold text-white">
              Recommended Next Step
            </h4>

            <p className="text-sm leading-7 text-slate-300">
              {record.analysis.recommendedNextStep}
            </p>
          </div>
        ))}
      </section>

      <p className="text-xs leading-6 text-slate-500">
        Comparison based on previously saved,
        AI-generated reports. Scores and conclusions
        are not independently verified.
      </p>
    </div>
  );
}


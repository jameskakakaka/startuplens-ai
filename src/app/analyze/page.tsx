import StartupAnalysisWorkspace from
  "@/components/startup/StartupAnalysisWorkspace";

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16">

      <div className="mx-auto max-w-5xl">

        <header className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400">
            AI Investment Intelligence
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            StartupLens AI
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            AI-powered startup analysis for
            early-stage investment screening.
          </p>
        </header>

        <StartupAnalysisWorkspace />

      </div>
    </main>
  );
}


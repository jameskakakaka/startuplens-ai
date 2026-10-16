
import Link from "next/link";

export default function AppNavigation() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-bold text-white"
        >
          StartupLens AI
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="/analyze"
            className="text-slate-300 hover:text-cyan-400"
          >
            Analyze
          </Link>

          <Link
            href="/history"
            className="text-slate-300 hover:text-cyan-400"
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}


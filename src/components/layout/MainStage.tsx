"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface MainStageProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function MainStage({ children, title, description }: MainStageProps) {
  return (
    <main className="flex-1 bg-slate-950 min-h-screen text-slate-100 flex flex-col relative z-0">
      <header className="px-8 py-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md flex flex-col gap-1.5">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-bold">VphyLAB</Link>
          <span>/</span>
          <Link href="/experiments" className="hover:text-white transition">Experiments</Link>
          <span>/</span>
          <span className="text-slate-300">Optics</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
            {description && <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">{description}</p>}
          </div>
          <Link
            href="/experiments"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition flex-shrink-0"
          >
            ← All Experiments
          </Link>
        </div>
      </header>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px]">
          {children}
        </div>
      </div>
    </main>
  );
}

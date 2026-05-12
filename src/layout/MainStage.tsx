"use client";

import { ReactNode } from "react";

interface MainStageProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function MainStage({ children, title, description }: MainStageProps) {
  return (
    <main className="flex-1 bg-slate-950 min-h-screen text-slate-100 flex flex-col relative z-0">
      <header className="p-8 border-b border-slate-900 bg-slate-950/50 flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
        {description && <p className="text-slate-400 max-w-2xl">{description}</p>}
      </header>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px]">
          {children}
        </div>
      </div>
    </main>
  );
}

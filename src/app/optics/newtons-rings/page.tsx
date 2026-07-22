import React from "react";
import Link from "next/link";
import { NewtonsRingsApp } from "@/components/experiments/optics/newtons-rings/NewtonsRingsApp";
import { TheoryCard } from "@/components/experiments/optics/newtons-rings/TheoryCard";
import { ResetLabButton } from "@/components/shared/ResetLabButton";
import { SetupSchematic } from "@/components/experiments/optics/newtons-rings/SetupSchematic";

export const metadata = {
  title: "Newton's Rings Simulator | VphyLAB",
  description: "Interactive virtual experiment to determine the wavelength of sodium light using Newton's Rings.",
};

export default function NewtonsRingsExperimentPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden pt-16">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-6 shadow-md backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 transition font-bold text-xl drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
            VphyLAB
          </Link>
          <div className="h-6 w-px bg-slate-700"></div>
          <Link href="/experiments" className="text-slate-400 hover:text-white transition font-medium text-sm">
            Experiments
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-slate-300">Optics</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full text-xs font-medium font-mono uppercase tracking-wider hidden sm:block">
             Module O-21
           </span>
           <ResetLabButton />
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="w-full max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
        
        {/* Left Interactive Apparatus (Spans 8 columns on lg) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-none bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative min-h-[650px]">
            <NewtonsRingsApp />
          </div>

          {/* Setup Schematic Diagram */}
          <SetupSchematic />

          {/* Theory Card - moved below the lab workspace for less visual clutter */}
          <div id="theory-container" className="relative">
             <TheoryCard />
          </div>
        </div>

        {/* Right Sidebar for Data & Observations (Spans 4 columns) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-auto shrink-0 flex-1 min-h-[500px]" id="observation-table-container">
            {/* Observation Table will be injected here via portal by NewtonsRingsApp -> ObservationTable mounting to it */}
          </div>
        </div>

      </div>
    </main>
  );
}

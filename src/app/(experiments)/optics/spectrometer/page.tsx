import SpectrometerApp from "@/components/experiments/optics/spectrometer/SpectrometerApp";
import { TheoryCard } from "@/components/experiments/optics/spectrometer/TheoryCard";
import { Stopwatch } from "@/components/experiments/optics/spectrometer/Stopwatch";
import Link from "next/link";
import { ResetLabButton } from "@/components/shared/ResetLabButton";

export const metadata = {
  title: "2D Interactive Spectrometer | Virtual Physics Lab",
  description: "Determine the wavelength of spectral lines using a plane transmission grating.",
};

export default function SpectrometerLabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      
      {/* Top Universal Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-6 shadow-md backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 transition font-bold text-xl drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
            VphyLAB
          </Link>
          <div className="h-6 w-px bg-slate-700"></div>
          <span className="font-semibold text-slate-300">Optics</span>
        </div>
        
        {/* Central Title */}
        <div className="hidden md:flex flex-col items-center">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
              2D Top-Down Spectrometer
            </h1>
        </div>

        <div className="flex items-center gap-4">
           <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-medium font-mono uppercase tracking-wider hidden sm:block">
             Module O-14
           </span>
           <ResetLabButton />
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        
        {/* Left Side */}
        <div className="flex-[2] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative min-h-[600px]">
          <SpectrometerApp />
        </div>
        
        {/* Right Sidebar for UI/Data/Views */}
        <div className="flex-[1.2] flex flex-col gap-6 pb-4">
          <div className="h-64 shrink-0 bg-slate-900 rounded-xl border border-slate-800 shadow-xl" id="eyepiece-hud-container">
            {/* Viewfinder HUD will be injected here via portal or state */}
          </div>

          <Stopwatch />
          
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden shrink-0 min-h-[500px]" id="observation-table-container">
            {/* Observation Table will go here */}
          </div>

          <TheoryCard />
        </div>
      </div>
    </main>
  );
}

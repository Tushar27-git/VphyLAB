import Link from 'next/link';
import { Activity, Zap, Target, Waves } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Subtle animated background grid / particles effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIzIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-blue-400 text-sm font-medium tracking-wider uppercase px-2">Final Integration</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
            Virtual Physics Lab
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Welcome to the advanced interactive physics laboratory. Select an experiment module to initialize the simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Bar Pendulum */}
          <Link href="/oscillation/bar-pendulum" className="group relative block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-slate-500 text-sm font-mono opacity-50">MOD-01</div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-blue-300 transition-colors">Bar Pendulum</h2>
              <p className="text-slate-400 line-clamp-2">
                Investigate the time period of a bar pendulum and determine acceleration due to gravity (g).
              </p>
            </div>
          </Link>
          
          {/* Optical Fibre */}
          <Link href="/optics/fiber-aperture" className="group relative block">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-slate-500 text-sm font-mono opacity-50">MOD-02</div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-emerald-300 transition-colors">Optical Fibre</h2>
              <p className="text-slate-400 line-clamp-2">
                Study the numerical aperture and acceptance angle of a specialized optical fibre array.
              </p>
            </div>
          </Link>

          {/* Newton's Rings */}
          <Link href="/optics/newtons-rings" className="group relative block">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800/50 hover:border-amber-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-slate-500 text-sm font-mono opacity-50">MOD-03</div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-amber-300 transition-colors">Newton's Rings</h2>
              <p className="text-slate-400 line-clamp-2">
                Observe interference patterns and determine the specific wavelength of sodium light.
              </p>
            </div>
          </Link>

          {/* Spectrometer */}
          <Link href="/optics/spectrometer" className="group relative block">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800/50 hover:border-rose-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Waves className="w-8 h-8 text-rose-400" />
                </div>
                <div className="text-slate-500 text-sm font-mono opacity-50">MOD-04</div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-rose-300 transition-colors">2D Spectrometer</h2>
              <p className="text-slate-400 line-clamp-2">
                Use a high-precision spectrometer to measure angles of a prism and determine dispersive power.
              </p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Decorative footer element */}
      <div className="absolute bottom-4 text-slate-600 text-xs font-mono tracking-widest opacity-50">
        SYS.VER // 4.0.1 // ONLINE
      </div>
    </div>
  );
}

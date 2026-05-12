'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  LayoutGrid, FlaskConical, Database, BarChart3, Settings,
  Bell, HelpCircle, TrendingUp, Clock, CheckCircle2, Plus,
  Network, Cable, CircleDot, Activity, Download, Loader2
} from 'lucide-react';
import {
  getRecentLogs,
  exportToCSV,
  type ExperimentLog,
} from '@/lib/lib/firebase/experiments';

const experiments = [
  {
    id: 'MOD-01',
    title: 'Bar Pendulum',
    description: 'Calculate the acceleration due to gravity (g) using a compound pendulum model.',
    href: '/oscillation/bar-pendulum',
    icon: Network,
  },
  {
    id: 'MOD-02',
    title: 'Optical Fibre',
    description: 'Measure numerical aperture and transmission losses in graded-index fibres.',
    href: '/optics/fiber-aperture',
    icon: Cable,
  },
  {
    id: 'MOD-03',
    title: "Newton's Rings",
    description: 'Determine the radius of curvature of a plano-convex lens via interference patterns.',
    href: '/optics/newtons-rings',
    icon: CircleDot,
  },
  {
    id: 'MOD-04',
    title: '2D Spectrometer',
    description: 'Analyze atomic emission spectra and calculate Rydberg constants for various gases.',
    href: '/optics/spectrometer',
    icon: Activity,
  },
  {
    id: 'MOD-05',
    title: 'RC Circuit Simulator',
    description: 'Study exponential charging and discharging of a capacitor in an RC circuit.',
    href: '/circuits/rc-circuit',
    icon: Activity,
  },
];

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', active: true },
  { icon: FlaskConical, label: 'Experiments', active: false },
  { icon: Database, label: 'Data Log', active: false },
  { icon: BarChart3, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} // ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function Home() {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useEffect(() => {
    getRecentLogs(10)
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setIsLoadingLogs(false));
  }, []);

  const totalCompleted = logs.filter((l) => l.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen flex">
      {/* ──── Side Navigation ──── */}
      <nav className="fixed left-0 top-0 h-full flex-col pt-16 z-40 bg-slate-950 w-64 border-r border-white/5 hidden lg:flex">
        <div className="p-6 mb-4">
          <div className="text-teal-400 font-black text-xs uppercase tracking-wider font-[var(--font-public-sans)]">
            GTBIT PHYSICS LAB
          </div>
          <div className="text-slate-500 text-[10px] tracking-[0.15em] font-[var(--font-space-grotesk)] mt-1">
            CORE RESEARCH FACILITY
          </div>
        </div>
        <div className="flex flex-col flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                className={`py-3 px-6 flex items-center gap-3 text-xs uppercase tracking-wider font-[var(--font-space-grotesk)] font-medium transition-colors ${
                  item.active
                    ? 'text-teal-400 bg-teal-400/10 border-r-2 border-teal-400'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* GTBIT Branding */}
        <div className="p-6 border-t border-white/5">
          <div className="text-[10px] text-slate-600 font-[var(--font-space-grotesk)] tracking-widest text-center">
            © 2025 GTBIT
          </div>
          <div className="text-[9px] text-slate-700 font-[var(--font-space-grotesk)] tracking-widest text-center mt-1">
            Guru Tegh Bahadur Institute of Technology
          </div>
        </div>
      </nav>

      {/* ──── Top Navigation Bar ──── */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 font-[var(--font-public-sans)]">
        <div className="flex items-center gap-8">
          <span className="text-sm font-bold tracking-widest text-slate-100 uppercase">
            VIRTUAL PHYSICS LAB
          </span>
          <div className="hidden md:flex items-center bg-white/5 px-3 py-1 rounded-lg border border-white/5">
            <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-slate-300 w-48 font-[var(--font-space-grotesk)]"
              placeholder="Search experiments..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-teal-400 font-[var(--font-space-grotesk)] text-[10px] tracking-[0.2em]">
            SYS.VER // 4.0.1 // ONLINE
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:bg-white/5 transition-all duration-200 p-1 rounded">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:bg-white/5 transition-all duration-200 p-1 rounded">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-slate-100 leading-none">GTBIT STUDENT</div>
                <div className="text-[10px] text-teal-500 font-[var(--font-space-grotesk)] leading-none mt-1">RESEARCHER</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-teal-500/30 bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold">
                GT
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ──── Main Content Canvas ──── */}
      <main className="lg:pl-64 pt-20 pb-12 pr-6 lg:pr-12 pl-6 min-h-screen flex-1">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* ── Hero Section ── */}
          <section className="relative overflow-hidden p-8 rounded-xl bg-slate-900 border border-white/10">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-gradient-to-l from-teal-500/20 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-teal-400 font-[var(--font-space-grotesk)] text-[10px] tracking-widest uppercase font-medium">
                  System Status: Operational
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2 font-[var(--font-public-sans)] tracking-tight leading-tight">
                GTBIT Research Portal
              </h1>
              <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
                Access high-fidelity simulations for complex physics experiments. Integrated data
                logging and real-time visualization for university-grade research and learning.
              </p>
            </div>
          </section>

          {/* ── Lab Overview Metrics ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0F172A] border border-white/10 p-5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[10px] tracking-widest uppercase font-medium">
                  Available Modules
                </span>
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div className="mt-4">
                <div className="text-4xl font-[var(--font-public-sans)] text-slate-100 font-bold">5</div>
                <div className="text-xs text-teal-500/80 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>All experiments online</span>
                </div>
              </div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 p-5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[10px] tracking-widest uppercase font-medium">
                  Sessions Logged
                </span>
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              </div>
              <div className="mt-4">
                <div className="text-4xl font-[var(--font-public-sans)] text-slate-100 font-bold">
                  {isLoadingLogs ? '...' : totalCompleted || '0'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Saved to cloud storage</div>
              </div>
            </div>
            <div className="bg-[#0F172A] border border-white/10 p-5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 font-[var(--font-space-grotesk)] text-[10px] tracking-widest uppercase font-medium">
                  Data Points
                </span>
                <Clock className="w-5 h-5 text-teal-400" />
              </div>
              <div className="mt-4">
                <div className="text-4xl font-[var(--font-public-sans)] text-slate-100 font-bold">
                  {isLoadingLogs ? '...' : logs.reduce((sum, l) => sum + (l.data?.length || 0), 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Total observations recorded</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Experiment Modules ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-[var(--font-public-sans)] font-semibold text-slate-100">
                Experiment Modules
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiments.map((exp) => {
                const Icon = exp.icon;
                return (
                  <Link
                    key={exp.id}
                    href={exp.href}
                    className="bg-[#0F172A] border border-white/10 p-5 rounded-lg glow-sm transition-all group block"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-[var(--font-space-grotesk)] text-[10px] bg-white/5 text-slate-300 px-2 py-1 rounded font-medium">
                        {exp.id}
                      </span>
                      <div className="w-8 h-8 flex items-center justify-center bg-teal-400/10 rounded group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-teal-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-[var(--font-public-sans)] font-semibold text-slate-100 mb-2 group-hover:text-teal-300 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {exp.description}
                    </p>
                    <div className="w-full py-2 bg-teal-500 text-slate-900 text-center text-[12px] font-[var(--font-space-grotesk)] font-medium rounded tracking-wider uppercase group-hover:bg-teal-400 transition-colors">
                      INITIALIZE SIMULATION
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Recent Data Logs ── */}
          <section className="bg-[#0F172A] border border-white/10 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-[var(--font-public-sans)] font-semibold text-slate-100">
                Recent Data Logs
              </h2>
              <div className="flex items-center gap-2">
                {isLoadingLogs && <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-medium">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-medium">
                      Experiment Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-medium">
                      Session ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {logs.length === 0 && !isLoadingLogs && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm italic">
                        No experiment logs yet. Complete an experiment and save to see data here.
                      </td>
                    </tr>
                  )}
                  {logs.map((log, i) => (
                    <tr key={log.id || i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-slate-300 font-[var(--font-space-grotesk)] text-xs">
                        {formatTimestamp(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-medium text-sm">
                        {log.experimentName}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-[var(--font-space-grotesk)] text-xs">
                        {log.sessionId}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-2 text-[11px] font-bold ${
                            log.status === 'COMPLETED' ? 'text-teal-400' : 'text-amber-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'COMPLETED' ? 'bg-teal-400' : 'bg-amber-400'
                            }`}
                          />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-teal-400 hover:underline font-[var(--font-space-grotesk)] text-[11px] font-medium flex items-center gap-1"
                          onClick={() => exportToCSV(log.experimentName, log.data)}
                        >
                          <Download className="w-3 h-3" />
                          EXPORT CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ── Floating Action Button ── */}
      <Link
        href="/oscillation/bar-pendulum"
        className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-slate-900 rounded-full shadow-lg shadow-teal-500/20 flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </Link>
    </div>
  );
}

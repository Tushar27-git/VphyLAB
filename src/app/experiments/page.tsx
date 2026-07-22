'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Network,
  Cable,
  CircleDot,
  Activity,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';

interface ExperimentModule {
  id: string;
  title: string;
  category: 'Oscillation & Mechanics' | 'Optics & Modern Physics' | 'Circuits & Electronics';
  description: string;
  href: string;
  icon: React.ElementType;
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

const experimentModules: ExperimentModule[] = [
  {
    id: 'MOD-01',
    title: 'Bar Pendulum',
    category: 'Oscillation & Mechanics',
    description: 'Calculate the acceleration due to gravity (g) and the radius of gyration (k) using a high-precision compound pendulum model with 19 symmetrical holes.',
    href: '/oscillation/bar-pendulum',
    icon: Network,
    features: [
      'Compound Pendulum Dynamics',
      'Real-time T vs L Characteristic Curve',
      'Symmetrical Hole Selection (1-19)',
      'Automated Data Logging & CSV Export',
    ],
    difficulty: 'Intermediate',
    duration: '35 - 45 mins',
  },
  {
    id: 'MOD-02',
    title: 'Optical Fibre',
    category: 'Optics & Modern Physics',
    description: 'Measure the numerical aperture (NA), acceptance angle, and transmission losses across step-index and graded-index optical fibres under laser illumination.',
    href: '/optics/fiber-aperture',
    icon: Cable,
    features: [
      'Numerical Aperture (NA) Calculation',
      'Step vs Graded-Index Simulation',
      'Acceptance Cone Visualization',
      'Bending & Attenuation Loss Analysis',
    ],
    difficulty: 'Advanced',
    duration: '40 - 50 mins',
  },
  {
    id: 'MOD-03',
    title: "Newton's Rings",
    category: 'Optics & Modern Physics',
    description: 'Determine the radius of curvature (R) of a plano-convex lens and the wavelength of sodium light via concentric optical interference fringe patterns.',
    href: '/optics/newtons-rings',
    icon: CircleDot,
    features: [
      'Concentric Interference Fringe Rendering',
      'High-Precision Micrometer Simulation',
      'Plano-Convex Lens Geometry Controls',
      'Fringe Diameter vs Ring Number Plot',
    ],
    difficulty: 'Intermediate',
    duration: '45 - 60 mins',
  },
  {
    id: 'MOD-04',
    title: '2D Spectrometer',
    category: 'Optics & Modern Physics',
    description: 'Analyze discrete atomic emission spectra across hydrogen, helium, mercury, and neon discharge tubes to calculate Rydberg constants and diffraction angles.',
    href: '/optics/spectrometer',
    icon: Activity,
    features: [
      'Multi-Gas Discharge Tube Selection',
      'Diffraction Grating & Prism Optics',
      'Vernier Scale Angle Reading Tool',
      'Rydberg Constant (R_H) Derivation',
    ],
    difficulty: 'Advanced',
    duration: '50 - 65 mins',
  },
  {
    id: 'MOD-05',
    title: 'RC Circuit Simulator',
    category: 'Circuits & Electronics',
    description: 'Study exponential voltage buildup and decay in resistor-capacitor (RC) networks to verify the time constant (τ = RC) using real-time oscilloscope plotting.',
    href: '/circuits/rc-circuit',
    icon: Zap,
    features: [
      'Interactive Switches & Power Supply',
      'Real-Time Voltmeter & Stopwatch',
      'Charging & Discharging V vs T Curves',
      'Theoretical vs Experimental Overlay',
    ],
    difficulty: 'Beginner',
    duration: '30 - 40 mins',
  },
];

type CategoryFilter = 'All' | 'Oscillation & Mechanics' | 'Optics & Modern Physics' | 'Circuits & Electronics';

export default function ExperimentsHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'difficulty'>('id');

  const filteredAndSortedModules = useMemo(() => {
    return experimentModules
      .filter((mod) => {
        const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          mod.title.toLowerCase().includes(q) ||
          mod.id.toLowerCase().includes(q) ||
          mod.description.toLowerCase().includes(q) ||
          mod.features.some((f) => f.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'id') return a.id.localeCompare(b.id);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') {
          const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return order[a.difficulty] - order[b.difficulty];
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, sortBy]);

  const categories: { label: CategoryFilter; count: number }[] = [
    { label: 'All', count: experimentModules.length },
    {
      label: 'Oscillation & Mechanics',
      count: experimentModules.filter((m) => m.category === 'Oscillation & Mechanics').length,
    },
    {
      label: 'Optics & Modern Physics',
      count: experimentModules.filter((m) => m.category === 'Optics & Modern Physics').length,
    },
    {
      label: 'Circuits & Electronics',
      count: experimentModules.filter((m) => m.category === 'Circuits & Electronics').length,
    },
  ];

  const getDifficultyBadge = (difficulty: ExperimentModule['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <PortalLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search modules by name, ID, or parameters..."
    >
      <div className="space-y-10">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-900 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-blue-500 to-transparent" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider mb-4 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Physics Experiment Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-4 font-[var(--font-public-sans)] tracking-tight">
              Interactive Simulation Hub
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Select any verified university laboratory module to initialize high-fidelity physics simulations. Every experiment includes interactive instrumentation, automated data logging, and exportable CSV tables.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium font-[var(--font-space-grotesk)] uppercase tracking-wider">
              <div className="flex items-center gap-2 text-teal-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>5 Verified Modules Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Real-Time Characteristic Plotting</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Theoretical Formulas Included</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter & Search Controls ── */}
        <section className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 rounded-xl space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`px-4 py-2 rounded-lg text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25 scale-105'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-white/5'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown & Local Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by name, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 transition font-[var(--font-space-grotesk)]"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-white/10 text-xs text-slate-300 font-[var(--font-space-grotesk)]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-slate-200 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="id" className="bg-slate-900 text-slate-200">ID (MOD-01 → MOD-05)</option>
                  <option value="title" className="bg-slate-900 text-slate-200">Title (A → Z)</option>
                  <option value="difficulty" className="bg-slate-900 text-slate-200">Difficulty Level</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ── Modules Grid ── */}
        <section>
          {filteredAndSortedModules.length === 0 ? (
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-16 text-center space-y-4">
              <Filter className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-slate-300 font-[var(--font-public-sans)]">
                No modules match your current filters
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try clearing your search query or selecting a different category to view available lab modules.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 rounded-lg text-xs font-bold uppercase tracking-wider font-[var(--font-space-grotesk)] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-[0_0_35px_rgba(45,212,191,0.12)] transition-all duration-300 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-[var(--font-space-grotesk)] text-xs bg-slate-950 text-teal-400 font-extrabold px-3 py-1 rounded-md border border-white/10 shadow-inner">
                          {mod.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyBadge(
                              mod.difficulty
                            )}`}
                          >
                            {mod.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/10 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-teal-400 transition-all duration-300 shadow-lg">
                          <Icon className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-[var(--font-public-sans)] font-extrabold text-slate-100 group-hover:text-teal-300 transition-colors">
                            {mod.title}
                          </h3>
                          <span className="text-[11px] font-[var(--font-space-grotesk)] uppercase tracking-wider text-slate-400 font-medium">
                            {mod.category}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                        {mod.description}
                      </p>

                      {/* Features Checklist */}
                      <div className="space-y-2 mb-8 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold mb-3">
                          Key Capabilities
                        </div>
                        {mod.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Action */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                      <div className="text-[11px] text-slate-400 font-[var(--font-space-grotesk)]">
                        <span className="text-slate-500">Est. Time: </span>
                        <span className="text-slate-300 font-bold">{mod.duration}</span>
                      </div>
                      <Link
                        href={mod.href}
                        className="flex-1 max-w-[200px] py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-[var(--font-space-grotesk)] text-xs font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 group/btn shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.03]"
                      >
                        <span>Launch Lab</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PortalLayout>
  );
}

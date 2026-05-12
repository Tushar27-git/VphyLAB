'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBarPendulum } from '@/features/oscillation/hooks/useBarPendulum';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import Link from "next/link";
import { ResetLabButton } from "@/components/shared/ResetLabButton";
import { BarPendulumTheoryCard } from "@/components/experiments/oscillation/bar-pendulum/BarPendulumTheoryCard";
import { BarPendulumObservationTable } from "@/components/experiments/oscillation/bar-pendulum/BarPendulumObservationTable";
import { BarPendulumCalculations } from "@/components/experiments/oscillation/bar-pendulum/BarPendulumCalculations";

interface Reading {
  hole: number;
  signedDistance: number | string;
  time20Vibs: number | string;
  timePeriod: number | string;
}

/**
 * PendulumCanvas renders the swinging bar in its own isolated animation loop.
 * It reads from `angleRef` every frame and writes directly to the DOM,
 * completely bypassing React reconciliation for silky-smooth rendering.
 */
function PendulumCanvas({
  angleRef,
  barHeightPx,
  holeSpacingPx,
  selectedHole,
  transformOriginY,
}: {
  angleRef: React.RefObject<number>;
  barHeightPx: number;
  holeSpacingPx: number;
  selectedHole: number;
  transformOriginY: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let prev = 0;
    const loop = (ts: number) => {
      // Only write to the DOM when the value has actually changed
      if (barRef.current && angleRef.current !== undefined) {
        barRef.current.style.transform = `rotate(${angleRef.current}rad)`;
      }
      prev = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [angleRef]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
      {/* Hinge Pin */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 shadow-sm z-10 border-2 border-slate-500" />

      {/* Engineered Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Pendulum Bar — NO CSS transitions, driven purely by rAF */}
      <div
        ref={barRef}
        className="absolute left-[50%] -translate-x-1/2 w-8 bg-slate-400 rounded shadow-md z-0 border border-slate-500"
        style={{
          height: `${barHeightPx}px`,
          transformOrigin: `50% ${transformOriginY}px`,
          top: `calc(20% - ${transformOriginY}px)`,
          willChange: 'transform',
        }}
      >
        {/* Center of Gravity Line */}
        <div
          className="absolute left-1/2 w-12 h-0.5 bg-red-500 -translate-x-1/2 shadow-sm"
          style={{ top: `${barHeightPx / 2}px` }}
        />

        {Array.from({ length: 19 }).map((_, i) => (
          <div
            key={i + 1}
            className={`absolute left-1/2 w-2 h-2 rounded-full -translate-x-1/2 shadow-inner z-20 border ${
              selectedHole === i + 1
                ? 'bg-blue-500 border-blue-400'
                : 'bg-slate-600 border-slate-700'
            }`}
            style={{ top: `${(i + 1) * holeSpacingPx - 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BarPendulumExperiment() {
  const { selectedHole, setSelectedHole, metrics, simulationState } = useBarPendulum({
    barLength: 1.0,
  });

  const [readings, setReadings] = useState<Reading[]>([]);

  // Track which hole the current timer run belongs to.
  // When the user changes holes, any un-logged timer value becomes stale.
  const timerHoleRef = useRef<number>(selectedHole);
  // Snapshot of the paused time that is guaranteed to belong to the current hole
  const [pausedSnapshot, setPausedSnapshot] = useState<{ hole: number; time: number } | null>(null);

  // Expanded scale for "Whole Big Screen"
  const barHeightPx = 520;
  const holeSpacingPx = barHeightPx / 20;
  const transformOriginY = selectedHole * holeSpacingPx;

  // ──── Attach the stopwatch ref to the DOM span ────
  const stopwatchSpanRef = useCallback(
    (node: HTMLSpanElement | null) => {
      simulationState.stopwatchElRef.current = node;
    },
    [simulationState.stopwatchElRef],
  );

  // ──── Wrap hole change to invalidate stale timer values ────
  const handleHoleChange = useCallback((newHole: number) => {
    setSelectedHole(newHole);
    simulationState.resetSimulation();
    timerHoleRef.current = newHole;
    setPausedSnapshot(null); // invalidate any stale paused value
  }, [setSelectedHole, simulationState]);

  // ──── Wrap toggle to capture a hole-stamped snapshot ────
  const handleToggleSimulation = useCallback(() => {
    if (simulationState.isRunning) {
      // Pausing — capture snapshot tagged with the current hole
      const snapTime = simulationState.simTimeRef.current;
      setPausedSnapshot({ hole: timerHoleRef.current, time: snapTime });
    } else {
      // Starting — mark this run as belonging to the current hole
      timerHoleRef.current = selectedHole;
    }
    simulationState.toggleSimulation();
  }, [simulationState, selectedHole]);

  // ──── Reading / logging helpers ────
  // Logs the ACTUAL stopwatch time as practical values (just like a real lab).
  // User flow: start timer → let it swing → pause → click Log.

  const handleAddReading = () => {
    if (selectedHole === 10) return;
    if (readings.some(r => r.hole === selectedHole)) return;

    // Only log if we have a valid paused snapshot for THIS hole
    if (!pausedSnapshot || pausedSnapshot.hole !== selectedHole || pausedSnapshot.time <= 0) return;

    const t20 = pausedSnapshot.time;
    const t = t20 / 20;

    setReadings(prev => {
      if (prev.find(p => p.hole === selectedHole)) return prev;

      return [...prev, {
        hole: selectedHole,
        signedDistance: metrics.signedDistanceFromCG,
        time20Vibs: Math.round(t20 * 100) / 100,   // 2 decimal places
        timePeriod: Math.round(t * 1000) / 1000,     // 3 decimal places
      }].sort((a, b) => (Number(a.signedDistance) - Number(b.signedDistance)));
    });
  };

  const handleLogManual = (hole: number) => {
    if (hole !== selectedHole) return;
    handleAddReading();
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (readings.length === 0) return;
    setIsSaving(true);
    try {
      const { saveExperimentData } = await import('@/lib/lib/firebase/experiments');
      await saveExperimentData(
        'bar-pendulum',
        'Bar Pendulum',
        readings.map(r => ({
          hole: r.hole,
          distanceFromCG_cm: Number(r.signedDistance) * 100,
          time20Vibrations_s: r.time20Vibs,
          timePeriod_s: r.timePeriod,
        }))
      );
      alert('✅ Data saved to cloud successfully!');
    } catch (err) {
      console.error(err);
      alert('⚠️ Cloud save failed — data backed up locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const generateGraphData = () => {
    const dataPoints = readings
      .filter(r => r.timePeriod !== null && r.timePeriod !== undefined && !isNaN(Number(r.timePeriod)))
      .map(r => ({
        x: Number(Number(r.signedDistance).toFixed(2)),
        y: parseFloat(r.timePeriod as string)
      }))
      .filter(d => d.y > 0); // exclude zero/invalid periods

    dataPoints.sort((a, b) => a.x - b.x);
    return dataPoints;
  };

  // Compute dynamic axis domains from actual data
  const computeAxisDomains = (data: { x: number; y: number }[]) => {
    if (data.length === 0) {
      return { xDomain: [-0.5, 0.5] as [number, number], yDomain: [0, 3] as [number, number], yTicks: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0] };
    }

    const yValues = data.map(d => d.y);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yRange = yMax - yMin || 0.5; // avoid zero range
    const yPadding = yRange * 0.2;
    const domainYMin = Math.max(0, Math.floor((yMin - yPadding) * 10) / 10);
    const domainYMax = Math.ceil((yMax + yPadding) * 10) / 10;

    // Generate nice tick marks for Y axis
    const yTickStep = parseFloat(((domainYMax - domainYMin) / 5).toPrecision(1));
    const yTicks: number[] = [];
    for (let v = domainYMin; v <= domainYMax + yTickStep * 0.01; v += yTickStep) {
      yTicks.push(parseFloat(v.toFixed(3)));
    }

    return {
      xDomain: [-0.5, 0.5] as [number, number],
      yDomain: [domainYMin, domainYMax] as [number, number],
      yTicks,
    };
  };

  // Pending reading preview — shows real stopwatch values when paused
  const getPendingReading = () => {
    if (selectedHole === 10) return null;
    if (readings.some(r => r.hole === selectedHole)) return null;
    const side = selectedHole >= 1 && selectedHole <= 9 ? 'A' as const : 'B' as const;
    const rowIndex = side === 'A' ? selectedHole : 20 - selectedHole;

    // Only show preview if we have a valid snapshot for THIS hole
    const hasValidSnapshot = pausedSnapshot && pausedSnapshot.hole === selectedHole && pausedSnapshot.time > 0;
    if (simulationState.isRunning || !hasValidSnapshot) {
      // Still show the row highlight but with no values yet
      return {
        hole: selectedHole,
        signedDistance: metrics.signedDistanceFromCG,
        time20Vibs: 0,
        timePeriod: 0,
        side,
        rowIndex,
      };
    }

    const t20 = pausedSnapshot.time;
    const t = t20 / 20;

    return {
      hole: selectedHole,
      signedDistance: metrics.signedDistanceFromCG,
      time20Vibs: Math.round(t20 * 100) / 100,
      timePeriod: Math.round(t * 1000) / 1000,
      side,
      rowIndex,
    };
  };

  const pendingReading = getPendingReading();
  const graphData = generateGraphData();
  const { xDomain, yDomain, yTicks } = computeAxisDomains(graphData);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">

      {/* Top Universal Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-6 shadow-md backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 transition font-bold text-xl drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
            VphyLAB
          </Link>
          <div className="h-6 w-px bg-slate-700"></div>
          <span className="font-semibold text-slate-300">Oscillation</span>
        </div>

        {/* Central Title */}
        <div className="hidden md:flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
            Bar Pendulum
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-medium font-mono uppercase tracking-wider hidden sm:block">
            Module O-01
          </span>
          <ResetLabButton />
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">

        {/* Left Side: Simulation & Plot */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative min-h-[600px] overflow-hidden">
            {/* Main Full-Screen Simulator Area — isolated canvas component */}
            <PendulumCanvas
              angleRef={simulationState.angleRef}
              barHeightPx={barHeightPx}
              holeSpacingPx={holeSpacingPx}
              selectedHole={selectedHole}
              transformOriginY={transformOriginY}
            />
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 flex flex-col min-h-[450px]">
            <h3 className="text-xl font-black text-white flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-blue-500 rounded-full" />
              Characteristic Curve: T vs L
            </h3>

            <div className="flex-1 w-full relative bg-slate-950 rounded-2xl border border-slate-800 p-4 min-h-[300px]">
              {readings.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                  <p className="font-mono text-sm">No data points logged. Record measurements to generate curve.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={xDomain}
                      ticks={[-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5]}
                      name="Distance from CG (m)"
                      label={{ value: 'Distance from CG (m)', position: 'insideBottom', offset: -10, style: { fill: '#64748b', fontSize: 11, fontWeight: 600 } }}
                      tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      dataKey="y"
                      type="number"
                      domain={yDomain}
                      ticks={yTicks}
                      name="Time Period (s)"
                      label={{ value: 'T (s)', angle: -90, position: 'insideLeft', offset: 5, style: { fill: '#64748b', fontSize: 11, fontWeight: 600 } }}
                      tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                      tickFormatter={(v: number) => v.toFixed(3)}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3', stroke: '#3b82f6' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${Number(value).toFixed(3)} s`, 'Time Period (T)']}
                      labelFormatter={(label) => `Distance: ${label} m`}
                    />
                    <Scatter
                      name="Dataset"
                      data={graphData}
                      fill="#3b82f6"
                      line={{ stroke: '#3b82f6', strokeWidth: 2 }}
                      shape={(props: any) => {
                        const { cx, cy } = props;
                        if (cx === undefined || cy === undefined || isNaN(cx) || isNaN(cy)) return null;
                        return (
                          <circle cx={cx} cy={cy} r={6} fill="#3b82f6" stroke="#0f172a" strokeWidth={2} />
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className="text-center text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-6">Theoretical Curve: T = 2π √((k² + l²) / gl)</p>
          </div>
        </div>

        {/* Right Sidebar for UI/Data/Views */}
        <div className="flex-[1.2] flex flex-col gap-6 pb-4">

          {/* Controls Panel */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-5 shrink-0 flex flex-col">
            <h2 className="text-[16px] font-bold text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
              Simulation Control
            </h2>

            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              Suspension Hole
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="19"
                step="1"
                value={selectedHole}
                onChange={(e) => {
                  handleHoleChange(parseInt(e.target.value));
                }}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl font-mono font-bold text-blue-400 text-lg shadow-inner">
                {selectedHole}
              </div>
            </div>

            <div className="mt-4 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Offset (L)</span>
              <span className="text-sm font-mono font-bold text-slate-300">{metrics.signedDistanceFromCG.toFixed(2)} m</span>
            </div>

            {/* Stopwatch Panel */}
            <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800 p-4">
              <p className="text-[11px] text-emerald-400 uppercase tracking-widest mb-2 font-bold relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Digital Stopwatch
              </p>

              {/*
                The stopwatch number is updated at native frame rate via
                stopwatchElRef — React never re-renders for this.
              */}
              <div className="text-[36px] text-white font-mono font-black tracking-tight relative z-10 leading-none mb-3">
                <span ref={stopwatchSpanRef}>0.00</span>
                <span className="text-xl text-slate-500 ml-1 font-bold">s</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    simulationState.resetSimulation();
                    setPausedSnapshot(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all active:scale-95"
                >
                  Zero
                </button>
                <button
                  onClick={handleToggleSimulation}
                  disabled={selectedHole === 10}
                  className={`flex-[2] py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                    simulationState.isRunning
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {simulationState.isRunning ? 'Pause Timer' : 'Start Timer'}
                </button>
              </div>
            </div>

            {/* Theoretical preview for current hole */}
            <div className="mt-4 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Theoretical Values</span>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">T (period)</span>
                <span className="text-sm font-mono font-bold text-blue-300">
                  {isFinite(metrics.timePeriod) ? metrics.timePeriod.toFixed(3) : '∞'} s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">T × 20</span>
                <span className="text-sm font-mono font-bold text-blue-300">
                  {isFinite(metrics.measuredTime20) ? metrics.measuredTime20.toFixed(2) : '∞'} s
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden shrink-0 flex flex-col relative" id="observation-table-container">
            <BarPendulumObservationTable
              data={readings}
              onAddRow={handleAddReading}
              onLogSpecificHole={handleLogManual}
              onSaveToFirebase={handleSave}
              selectedHole={selectedHole}
              pendingReading={pendingReading}
            />
          </div>

          <BarPendulumCalculations
            data={readings}
            barLength={1.0}
          />

          <BarPendulumTheoryCard />

        </div>
      </div>
    </main>
  );
}

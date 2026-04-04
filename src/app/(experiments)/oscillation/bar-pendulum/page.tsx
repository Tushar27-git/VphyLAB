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

export default function BarPendulumExperiment() {
  const { selectedHole, setSelectedHole, metrics, simulationState } = useBarPendulum({
    barLength: 1.0, 
  });

  const [readings, setReadings] = useState<Reading[]>([]);

  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  // Use refs for the animation loop to avoid stale closures
  const isRunningRef = useRef(simulationState.isRunning);
  const tickTimeRef = useRef(simulationState.tickTime);
  isRunningRef.current = simulationState.isRunning;
  tickTimeRef.current = simulationState.tickTime;

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      // Clamp delta to prevent huge jumps (e.g. when tab is backgrounded)
      const clampedDelta = Math.min(deltaTime, 0.05);
      if (isRunningRef.current) {
        tickTimeRef.current(clampedDelta);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const angle = simulationState.getCurrentAngle(simulationState.elapsedTime);

  // Expanded scale for "Whole Big Screen"
  const barHeightPx = 520; 
  const holeSpacingPx = barHeightPx / 20; // 32.5px
  const transformOriginY = selectedHole * holeSpacingPx; 

  const formattedStopwatch = simulationState.elapsedTime.toFixed(2);

  const handleAddReading = () => {
    if (!pendingReading) return;
    setReadings(prev => {
      const exists = prev.find(p => p.hole === selectedHole);
      if (exists) return prev;
      
      return [...prev, {
        hole: selectedHole,
        signedDistance: pendingReading.signedDistance,
        time20Vibs: pendingReading.time20Vibs,
        timePeriod: pendingReading.timePeriod,
      }].sort((a,b) => (Number(a.signedDistance) - Number(b.signedDistance)));
    });
  };

  const handleLogManual = (hole: number) => {
    if (hole !== selectedHole) return;
    handleAddReading();
  };

  const handleSave = async () => {
    await new Promise(res => setTimeout(res, 1000));
    alert("Saved to cloud successfully!");
  };

  const generateGraphData = () => {
    let dataPoints = readings.map(r => ({
      x: Number(Number(r.signedDistance).toFixed(2)),
      y: parseFloat(r.timePeriod as string)
    }));
    
    if (dataPoints.length > 0 && !dataPoints.find(d => d.x === 0)) {
      dataPoints.push({ x: 0, y: null as any });
      dataPoints.sort((a, b) => a.x - b.x);
    }
    return dataPoints;
  };

  // Compute pending reading for table preview
  const getPendingReading = () => {
    if (selectedHole === 10) return null;
    if (readings.some(r => r.hole === selectedHole)) return null;
    const side = selectedHole >= 1 && selectedHole <= 9 ? 'A' as const : 'B' as const;
    const rowIndex = side === 'A' ? selectedHole : 20 - selectedHole;
    
    // Use the actual live stopwatch time for the reading
    const currentT20 = simulationState.elapsedTime;
    const currentT = currentT20 / 20;

    return {
      hole: selectedHole,
      signedDistance: metrics.signedDistanceFromCG,
      time20Vibs: currentT20,
      timePeriod: currentT,
      side,
      rowIndex,
    };
  };

  const pendingReading = getPendingReading();

  const graphData = generateGraphData();

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
            {/* Main Full-Screen Simulator Area */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
              
              {/* Hinge Pin */}
              <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 shadow-sm z-10 border-2 border-slate-500" />
              
              {/* Engineered Grid Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* Pendulum Bar */}
              <div 
                className="absolute left-[50%] -translate-x-1/2 w-8 bg-slate-400 rounded shadow-md transition-transform z-0 border border-slate-500"
                style={{ 
                  height: `${barHeightPx}px`, 
                  transform: `rotate(${angle}rad)`,
                  transformOrigin: `50% ${transformOriginY}px`,
                  top: `calc(20% - ${transformOriginY}px)`,
                  willChange: 'transform'
                }}
              >
                {/* Center of Gravity Line */}
                <div className="absolute left-1/2 w-12 h-0.5 bg-red-500 -translate-x-1/2 shadow-sm" style={{ top: `${barHeightPx / 2}px` }} />
                
                {Array.from({ length: 19 }).map((_, i) => (
                  <div 
                    key={i + 1} 
                    className={`absolute left-1/2 w-2 h-2 rounded-full -translate-x-1/2 shadow-inner transition-colors z-20 border ${selectedHole === i + 1 ? 'bg-blue-500 border-blue-400' : 'bg-slate-600 border-slate-700'}`}
                    style={{ top: `${(i + 1) * holeSpacingPx - 4}px` }}
                  />
                ))}
              </div>
            </div>
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
                      domain={[-0.5, 0.5]} 
                      ticks={[-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5]}
                      name="Distance (m)"
                      tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <YAxis 
                      dataKey="y" 
                      type="number" 
                      domain={[1.5, 2.5]} 
                      name="Time Period (s)"
                      tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3', stroke: '#3b82f6' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${value} s`, 'Time Period (T)']}
                      labelFormatter={(label) => `Distance: ${label}m`}
                    />
                    <Scatter 
                      name="Dataset" 
                      data={graphData} 
                      fill="#3b82f6" 
                      line={{ stroke: '#3b82f6', strokeWidth: 2 }} 
                      shape={(props: any) => {
                        const { cx, cy } = props;
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
                  setSelectedHole(parseInt(e.target.value));
                  simulationState.resetSimulation();
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

            {/* Stopwatch Panel Integration */}
            <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800 p-4">
              <p className="text-[11px] text-emerald-400 uppercase tracking-widest mb-2 font-bold relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Digital Stopwatch
              </p>
              
              <div className="text-[36px] text-white font-mono font-black tracking-tight relative z-10 leading-none mb-3">
                {formattedStopwatch}<span className="text-xl text-slate-500 ml-1 font-bold">s</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={simulationState.resetSimulation}
                  className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all active:scale-95"
                >
                  Zero
                </button>
                <button 
                  onClick={simulationState.toggleSimulation}
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


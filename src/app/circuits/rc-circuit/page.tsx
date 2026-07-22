'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRCCircuit } from '@/features/circuits/hooks/useRCCircuit';
import { Voltmeter } from '@/features/circuits/components/Voltmeter';
import { CircuitSwitches } from '@/features/circuits/components/CircuitSwitches';
import { Stopwatch } from '@/features/circuits/components/Stopwatch';
import { ObservationTable, Observation } from '@/features/circuits/components/ObservationTable';
import { Graph, GraphData } from '@/features/circuits/components/Graph';
import { ResultsForm } from '@/features/circuits/components/ResultsForm';
import { ResetLabButton } from '@/components/shared/ResetLabButton';

export default function RCCircuitSimulator() {
  const rcCircuit = useRCCircuit();
  const [observations, setObservations] = useState<Observation[]>([]);

  // Generate theoretical curve data
  const generateTheoreticalData = useCallback((): GraphData[] => {
    const data: GraphData[] = [];
    const RC = rcCircuit.theoreticalValues.timeConstant;
    
    if (rcCircuit.circuitState.phase === 'charging') {
      for (let t = 0; t <= 100; t += 1) {
        const voltage = rcCircuit.theoreticalValues.timeConstant > 0
          ? rcCircuit.SYSTEM_CONSTANTS.V0 * (1 - Math.exp(-t / RC))
          : 0;
        data.push({ time: t, voltage });
      }
    } else if (rcCircuit.circuitState.phase === 'discharging') {
      for (let t = 0; t <= 100; t += 1) {
        const voltage = rcCircuit.circuitState.peakVoltage * Math.exp(-t / RC);
        data.push({ time: t, voltage });
      }
    }
    
    return data;
  }, [rcCircuit]);

  const handleAddObservation = useCallback((time: number, voltage: number) => {
    const id = `obs-${Date.now()}`;
    setObservations(prev => [...prev, { id, time, voltage }].sort((a, b) => a.time - b.time));
  }, []);

  const handleDeleteObservation = useCallback((id: string) => {
    setObservations(prev => prev.filter(obs => obs.id !== id));
  }, []);

  const handleResetAll = useCallback(() => {
    rcCircuit.resetAll();
    setObservations([]);
  }, [rcCircuit]);

  const theoreticalData = generateTheoreticalData();
  const graphData: GraphData[] = observations.map(obs => ({
    time: obs.time,
    voltage: obs.voltage,
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      {/* Top Navigation Bar */}
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
          <span className="font-semibold text-slate-300">Circuits</span>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
            RC Circuit Simulator
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-medium font-mono uppercase tracking-wider hidden sm:block">
            Module C-01
          </span>
          <button
            onClick={handleResetAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Reset Lab
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
        {/* Left Side: Voltmeter & Switches */}
        <div className="flex-[1] flex flex-col gap-6">
          <Voltmeter voltage={rcCircuit.circuitState.currentVoltage} />
          
          <CircuitSwitches
            mainPowerOn={rcCircuit.circuitState.mainPowerOn}
            chargingOn={rcCircuit.circuitState.chargingOn}
            dischargingOn={rcCircuit.circuitState.dischargingOn}
            onToggleMainPower={rcCircuit.toggleMainPower}
            onToggleCharging={rcCircuit.toggleCharging}
            onToggleDischarging={rcCircuit.toggleDischarging}
            onDump={rcCircuit.dumpCapacitor}
          />

          <Stopwatch
            isRunning={rcCircuit.stopwatchState.isRunning}
            elapsedTime={rcCircuit.stopwatchState.elapsedTime}
            stopwatchElRef={rcCircuit.stopwatchElRef}
            onStart={rcCircuit.startStopwatch}
            onStop={rcCircuit.stopStopwatch}
            onReset={rcCircuit.resetStopwatch}
          />

          {/* System Constants Reference */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">System Constants</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Resistance (R):</span>
                <span className="font-mono font-bold text-slate-200">10,000 Ω</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Capacitance (C):</span>
                <span className="font-mono font-bold text-slate-200">0.0047 F</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Supply Voltage (V₀):</span>
                <span className="font-mono font-bold text-slate-200">5 V</span>
              </div>
              <div className="border-t border-slate-800 pt-3 mt-3">
                <div className="flex justify-between p-2 bg-blue-500/10 rounded border border-blue-500/30 mb-2">
                  <span className="text-slate-400">Time Constant (τ):</span>
                  <span className="font-mono font-bold text-blue-300">{rcCircuit.theoreticalValues.timeConstant.toFixed(2)} s</span>
                </div>
                <div className="flex justify-between p-2 bg-purple-500/10 rounded border border-purple-500/30">
                  <span className="text-slate-400">Half-Life (T₁/₂):</span>
                  <span className="font-mono font-bold text-purple-300">{rcCircuit.theoreticalValues.halfLife.toFixed(2)} s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Data & Analysis */}
        <div className="flex-[1.5] flex flex-col gap-6">
          <ObservationTable
            observations={observations}
            onAddObservation={handleAddObservation}
            onDeleteObservation={handleDeleteObservation}
            currentTime={rcCircuit.stopwatchState.elapsedTime}
            currentVoltage={rcCircuit.circuitState.currentVoltage}
          />

          <Graph
            data={graphData}
            theoreticalData={theoreticalData}
            title={`Voltage vs Time - ${rcCircuit.circuitState.phase === 'charging' ? 'Charging' : rcCircuit.circuitState.phase === 'discharging' ? 'Discharging' : 'Idle'}`}
          />

          <ResultsForm theoreticalValues={rcCircuit.theoreticalValues} />
        </div>
      </div>
    </main>
  );
}

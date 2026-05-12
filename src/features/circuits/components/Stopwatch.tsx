import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface StopwatchProps {
  isRunning: boolean;
  elapsedTime: number;
  stopwatchElRef: React.MutableRefObject<HTMLSpanElement | null>;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function Stopwatch({
  isRunning,
  elapsedTime,
  stopwatchElRef,
  onStart,
  onStop,
  onReset,
}: StopwatchProps) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Digital Stopwatch
      </h3>

      <div className="bg-slate-950 rounded-lg border border-slate-800 p-6 mb-6">
        <div className="text-5xl font-mono font-black text-slate-100 text-center tracking-tight">
          <span ref={stopwatchElRef}>00:00.0</span>
          <span className="text-2xl text-slate-500 ml-2">s</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={isRunning ? onStop : onStart}
          className={`flex-[2] py-3 px-4 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
          Elapsed Time
        </div>
        <div className="text-sm font-mono text-slate-300">
          {elapsedTime.toFixed(2)} seconds
        </div>
      </div>
    </div>
  );
}

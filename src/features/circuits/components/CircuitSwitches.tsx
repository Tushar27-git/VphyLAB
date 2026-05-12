import React from 'react';
import { Power, Zap, RotateCcw, Trash2 } from 'lucide-react';

interface CircuitSwitchesProps {
  mainPowerOn: boolean;
  chargingOn: boolean;
  dischargingOn: boolean;
  onToggleMainPower: () => void;
  onToggleCharging: () => void;
  onToggleDischarging: () => void;
  onDump: () => void;
}

export function CircuitSwitches({
  mainPowerOn,
  chargingOn,
  dischargingOn,
  onToggleMainPower,
  onToggleCharging,
  onToggleDischarging,
  onDump,
}: CircuitSwitchesProps) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Circuit Control
      </h3>

      <div className="space-y-4">
        {/* Main Power Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Power className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-200">Main Power</span>
          </div>
          <button
            onClick={onToggleMainPower}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              mainPowerOn ? 'bg-green-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                mainPowerOn ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Charging Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <span className="text-sm font-semibold text-slate-200">Charging</span>
          </div>
          <button
            onClick={onToggleCharging}
            disabled={!mainPowerOn}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${
              chargingOn ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                chargingOn ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Discharging Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
            <span className="text-sm font-semibold text-slate-200">Discharging</span>
          </div>
          <button
            onClick={onToggleDischarging}
            disabled={!mainPowerOn}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${
              dischargingOn ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                dischargingOn ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Dump Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-slate-200">Dump</span>
          </div>
          <button
            onClick={onDump}
            disabled={!mainPowerOn}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 p-3 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">
          System Status
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${mainPowerOn ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-xs text-slate-300">
            {mainPowerOn ? 'Power ON' : 'Power OFF'}
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export interface Observation {
  id: string;
  time: number;
  voltage: number;
}

interface ObservationTableProps {
  observations: Observation[];
  onAddObservation: (time: number, voltage: number) => void;
  onDeleteObservation: (id: string) => void;
  currentTime: number;
  currentVoltage: number;
}

export function ObservationTable({
  observations,
  onAddObservation,
  onDeleteObservation,
  currentTime,
  currentVoltage,
}: ObservationTableProps) {
  const [timeInput, setTimeInput] = useState('');
  const [voltageInput, setVoltageInput] = useState('');

  const handleAdd = () => {
    const time = parseFloat(timeInput);
    const voltage = parseFloat(voltageInput);

    if (isNaN(time) || isNaN(voltage) || time < 0 || voltage < 0 || voltage > 15) {
      alert('Please enter valid values: Time ≥ 0, Voltage 0-15V');
      return;
    }

    onAddObservation(time, voltage);
    setTimeInput('');
    setVoltageInput('');
  };

  const handleQuickAdd = () => {
    onAddObservation(currentTime, currentVoltage);
    setTimeInput('');
    setVoltageInput('');
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6">Observation Table</h3>

      {/* Quick Add Section */}
      <div className="mb-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
          Quick Record
        </div>
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">Time (s)</label>
            <input
              type="number"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 block mb-1">Voltage (V)</label>
            <input
              type="number"
              value={voltageInput}
              onChange={(e) => setVoltageInput(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Manual
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors"
          >
            Record Current
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Time (s)
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Voltage (V)
              </th>
              <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {observations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500 text-xs italic">
                  No observations recorded yet
                </td>
              </tr>
            ) : (
              observations.map((obs) => (
                <tr key={obs.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {obs.time.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {obs.voltage.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Total Observations: {observations.length}
        </div>
      </div>
    </div>
  );
}

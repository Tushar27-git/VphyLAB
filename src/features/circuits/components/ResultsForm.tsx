import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultsFormProps {
  theoreticalValues: {
    halfLife: number;
    capacitance: number;
    timeConstant: number;
  };
}

interface ValidationResult {
  halfLife: { error: number; isCorrect: boolean } | null;
  capacitance: { error: number; isCorrect: boolean } | null;
  timeConstant: { error: number; isCorrect: boolean } | null;
}

export function ResultsForm({ theoreticalValues }: ResultsFormProps) {
  const [halfLife, setHalfLife] = useState('');
  const [capacitance, setCapacitance] = useState('');
  const [timeConstant, setTimeConstant] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationResult>({
    halfLife: null,
    capacitance: null,
    timeConstant: null,
  });

  const calculateError = (calculated: number, theoretical: number): number => {
    return Math.abs((calculated - theoretical) / theoretical) * 100;
  };

  const handleSubmit = () => {
    const results: ValidationResult = {
      halfLife: null,
      capacitance: null,
      timeConstant: null,
    };

    if (halfLife) {
      const value = parseFloat(halfLife);
      const error = calculateError(value, theoreticalValues.halfLife);
      results.halfLife = {
        error,
        isCorrect: error <= 5,
      };
    }

    if (capacitance) {
      const value = parseFloat(capacitance);
      const error = calculateError(value, theoreticalValues.capacitance);
      results.capacitance = {
        error,
        isCorrect: error <= 5,
      };
    }

    if (timeConstant) {
      const value = parseFloat(timeConstant);
      const error = calculateError(value, theoreticalValues.timeConstant);
      results.timeConstant = {
        error,
        isCorrect: error <= 5,
      };
    }

    setValidationResults(results);
  };

  const handleReset = () => {
    setHalfLife('');
    setCapacitance('');
    setTimeConstant('');
    setValidationResults({
      halfLife: null,
      capacitance: null,
      timeConstant: null,
    });
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6">Results & Validation</h3>

      <div className="space-y-4 mb-6">
        {/* Half-Life Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Half-Life (T₁/₂) - seconds
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={halfLife}
              onChange={(e) => setHalfLife(e.target.value)}
              placeholder="32.57"
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
            {validationResults.halfLife && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${validationResults.halfLife.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {validationResults.halfLife.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-xs font-bold ${validationResults.halfLife.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.halfLife.isCorrect ? '✓' : `${validationResults.halfLife.error.toFixed(1)}%`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Capacitance Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Capacitance (C) - Farads
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={capacitance}
              onChange={(e) => setCapacitance(e.target.value)}
              placeholder="0.0047"
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
            {validationResults.capacitance && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${validationResults.capacitance.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {validationResults.capacitance.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-xs font-bold ${validationResults.capacitance.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.capacitance.isCorrect ? '✓' : `${validationResults.capacitance.error.toFixed(1)}%`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Time Constant Input */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Time Constant (τ) - seconds
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={timeConstant}
              onChange={(e) => setTimeConstant(e.target.value)}
              placeholder="47"
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
            {validationResults.timeConstant && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${validationResults.timeConstant.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {validationResults.timeConstant.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-xs font-bold ${validationResults.timeConstant.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.timeConstant.isCorrect ? '✓' : `${validationResults.timeConstant.error.toFixed(1)}%`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
        >
          Validate Results
        </button>
        <button
          onClick={handleReset}
          className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Theoretical Values Reference */}
      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Theoretical Values (Reference)
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Half-Life (T₁/₂):</span>
            <span className="font-mono font-bold text-slate-200">{theoreticalValues.halfLife.toFixed(2)} s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Capacitance (C):</span>
            <span className="font-mono font-bold text-slate-200">{theoreticalValues.capacitance.toFixed(4)} F</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time Constant (τ):</span>
            <span className="font-mono font-bold text-slate-200">{theoreticalValues.timeConstant.toFixed(2)} s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

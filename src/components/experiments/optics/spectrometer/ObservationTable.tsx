"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { STANDARD_WAVELENGTHS } from "@/lib/physics/spectrometer";

interface ObservationTableProps {
  v1: number;
  v2: number;
}

type SpectralReading = {
  leftV1: number | null;
  leftV2: number | null;
  rightV1: number | null;
  rightV2: number | null;
};

export function ObservationTable({ v1, v2 }: ObservationTableProps) {
  const [mounted, setMounted] = useState(false);
  const colors = Object.keys(STANDARD_WAVELENGTHS);

  const COLOR_MAP: Record<string, string> = {
    Violet: "#c084fc",
    Indigo: "#818cf8",
    Blue: "#38bdf8",
    Green: "#4ade80",
    Yellow: "#fde047",
    Orange: "#fb923c",
    Red: "#f87171",
  };

  const [readings, setReadings] = useState<Record<string, SpectralReading>>(
    colors.reduce((acc, color) => ({
      ...acc,
      [color]: { leftV1: null, leftV2: null, rightV1: null, rightV2: null }
    }), {})
  );

  const [results, setResults] = useState<Record<string, { calculatedLambda: number, error: number }> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLog = (color: string, side: "left" | "right") => {
    setReadings(prev => ({
      ...prev,
      [color]: {
        ...prev[color],
        [`${side}V1`]: v1,
        [`${side}V2`]: v2,
      }
    }));
  };

  const calculateTheta = (r: SpectralReading) => {
    if (r.leftV1 === null || r.rightV1 === null) return null;
    let diff1 = Math.abs(r.leftV1 - r.rightV1);
    // handle wrap around 360
    if (diff1 > 180) diff1 = 360 - diff1;
    
    // Theta is half of the difference (2Theta = a-b)
    return diff1 / 2;
  };

  const handleCalculate = () => {
    const newResults: Record<string, { calculatedLambda: number, error: number }> = {};
    const gratingElement = 0.0254 / 15000; // meters

    colors.forEach(color => {
      const thetaDeg = calculateTheta(readings[color]);
      if (thetaDeg !== null) {
        const thetaRad = thetaDeg * (Math.PI / 180);
        // lambda = (a+b) * sin(theta)
        const calcLambdaMeters = gratingElement * Math.sin(thetaRad);
        
        // STANDARD_WAVELENGTHS[color] is given in meters. Wait, STANDARD_WAVELENGTHS is available... but TypeScript might complain about string indexing, let's cast it
        const stdLambda = (STANDARD_WAVELENGTHS as any)[color];
        
        const errorPercent = Math.abs((calcLambdaMeters - stdLambda) / stdLambda) * 100;
        
        newResults[color] = {
          calculatedLambda: calcLambdaMeters * 1e9, // Convert to nm
          error: errorPercent
        };
      }
    });

    setResults(newResults);
  };

  const tableContent = (
    <div className="w-full h-full p-4 flex flex-col items-center bg-slate-950 text-slate-200">
      <h2 className="text-xl font-bold text-white mb-4">Observation Table</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr className="bg-slate-800">
              <th className="p-2 border border-slate-700" rowSpan={2}>Color</th>
              <th className="p-2 border border-slate-700" colSpan={3}>Left Side</th>
              <th className="p-2 border border-slate-700" colSpan={3}>Right Side</th>
              <th className="p-2 border border-slate-700" rowSpan={2}>&theta; (deg)</th>
            </tr>
            <tr className="bg-slate-800">
              <th className="p-2 border border-slate-700">V1</th>
              <th className="p-2 border border-slate-700">V2</th>
              <th className="p-2 border border-slate-700">Action</th>
              <th className="p-2 border border-slate-700">V1</th>
              <th className="p-2 border border-slate-700">V2</th>
              <th className="p-2 border border-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {colors.map(color => {
              const r = readings[color];
              const theta = calculateTheta(r);
              return (
                <tr key={color} className="hover:bg-slate-900 transition-colors">
                   <td className="p-2 border border-slate-700 font-medium" style={{ color: COLOR_MAP[color] || '#ccc' }}>{color}</td>
                   <td className="p-2 border border-slate-700">{r.leftV1?.toFixed(1) ?? "-"}</td>
                   <td className="p-2 border border-slate-700">{r.leftV2?.toFixed(1) ?? "-"}</td>
                   <td className="p-2 border border-slate-700">
                     <button onClick={() => handleLog(color, "left")} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition">Log</button>
                   </td>
                   <td className="p-2 border border-slate-700">{r.rightV1?.toFixed(1) ?? "-"}</td>
                   <td className="p-2 border border-slate-700">{r.rightV2?.toFixed(1) ?? "-"}</td>
                   <td className="p-2 border border-slate-700">
                     <button onClick={() => handleLog(color, "right")} className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs transition">Log</button>
                   </td>
                   <td className="p-2 border border-slate-700 font-mono text-cyan-400">
                     {theta !== null ? theta.toFixed(2) : "-"}
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 self-start w-full bg-slate-900 border border-slate-800 rounded-lg p-4">
         <h3 className="font-semibold text-lg mb-2 text-white">Results & Calculation</h3>
         <p className="text-slate-400 text-sm mb-4">
           Using the grating formula (wavelength = (a+b)*sin(theta)/n), enter your calculated wavelengths to find the percentage error. Assume N = 15,000 LPI.
         </p>
         
         <button onClick={handleCalculate} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition text-white shadow-lg mb-6">
           Calculate Final Results
         </button>

         {results && (
           <div className="w-full overflow-x-auto bg-slate-950 rounded border border-slate-800 p-4">
             <table className="w-full text-center text-sm border-collapse">
               <thead>
                 <tr className="border-b border-slate-700 text-slate-400">
                   <th className="p-2 text-left">Color</th>
                   <th className="p-2">Known Wavelength λ (nm)</th>
                   <th className="p-2">Calculated Wavelength λ (nm)</th>
                   <th className="p-2">% Error</th>
                 </tr>
               </thead>
               <tbody>
                 {colors.map(color => {
                   if (!results[color]) return null;
                   const stdLambdaNm = ((STANDARD_WAVELENGTHS as any)[color] * 1e9).toFixed(1);
                   const isAccurate = results[color].error < 5;
                   return (
                     <tr key={color} className="border-b border-slate-800/50">
                       <td className="p-2 font-medium text-left" style={{ color: color === 'White' ? '#ccc' : color.toLowerCase() }}>{color}</td>
                       <td className="p-2 text-slate-300">{stdLambdaNm}</td>
                       <td className="p-2 text-cyan-400">{results[color].calculatedLambda.toFixed(1)}</td>
                       <td className={`p-2 font-mono ${isAccurate ? 'text-emerald-400' : 'text-red-400'}`}>
                         {results[color].error.toFixed(2)}%
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
             {Object.keys(results).length === 0 && (
                <div className="text-center text-slate-500 mt-4 italic">No completed readings to calculate.</div>
             )}
           </div>
         )}
      </div>
    </div>
  );

  if (!mounted) return null;
  const container = document.getElementById("observation-table-container");
  if (!container) return null;

  return createPortal(tableContent, container);
}

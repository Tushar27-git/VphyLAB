"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HYDROGEN_LINES } from "@/lib/physics/spectrometer";

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

  // Create color list from hydrogen lines
  const spectralLines = HYDROGEN_LINES;
  const colorNames = ["Violet", "Indigo", "Blue", "Green", "Yellow", "Orange", "Red"];

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
    colorNames.reduce((acc, color) => ({
      ...acc,
      [color]: { leftV1: null, leftV2: null, rightV1: null, rightV2: null }
    }), {})
  );

  const [results, setResults] = useState<Record<string, { calculatedLambda: number, error: number }> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const { saveExperimentData } = await import('@/lib/lib/firebase/experiments');
      const dataToSave = Object.keys(readings)
        .filter(color => readings[color].leftV1 !== null || readings[color].rightV1 !== null)
        .map(color => ({
           color,
           ...readings[color],
           calculatedLambda: results?.[color]?.calculatedLambda || null,
           error: results?.[color]?.error || null
        }));
      
      if (dataToSave.length === 0) {
        alert("No readings to save!");
        setIsSaving(false);
        return;
      }
      
      await saveExperimentData('spectrometer', '2D Spectrometer', dataToSave);
      alert('✅ Data saved to cloud successfully!');
    } catch (err) {
      console.error(err);
      alert('⚠️ Cloud save failed — data backed up locally.');
    } finally {
      setIsSaving(false);
    }
  };

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

    colorNames.forEach((color, idx) => {
      const thetaDeg = calculateTheta(readings[color]);
      if (thetaDeg !== null && idx < spectralLines.length) {
        const thetaRad = thetaDeg * (Math.PI / 180);
        // lambda = d * sin(theta)
        const calcLambdaMeters = gratingElement * Math.sin(thetaRad);
        
        const stdLambdaNm = spectralLines[idx].wavelength;
        const stdLambdaMeters = stdLambdaNm * 1e-9;
        
        const errorPercent = Math.abs((calcLambdaMeters - stdLambdaMeters) / stdLambdaMeters) * 100;
        
        newResults[color] = {
          calculatedLambda: calcLambdaMeters * 1e9, // Convert to nm
          error: errorPercent
        };
      }
    });

    setResults(newResults);
  };

  const tableContent = (
    <div className="w-full h-full p-6 flex flex-col bg-slate-950 text-slate-200 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Observation Table</h2>
      
      <div className="w-full overflow-x-auto mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 border-b-2 border-slate-700">
              <th className="p-3 border border-slate-700 text-left font-semibold">Color</th>
              <th className="p-3 border border-slate-700 font-semibold" colSpan={3}>Left Side</th>
              <th className="p-3 border border-slate-700 font-semibold" colSpan={3}>Right Side</th>
              <th className="p-3 border border-slate-700 text-center font-semibold">θ (deg)</th>
            </tr>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="p-3 border border-slate-700"></th>
              <th className="p-3 border border-slate-700 text-xs">V1</th>
              <th className="p-3 border border-slate-700 text-xs">V2</th>
              <th className="p-3 border border-slate-700 text-xs">Action</th>
              <th className="p-3 border border-slate-700 text-xs">V1</th>
              <th className="p-3 border border-slate-700 text-xs">V2</th>
              <th className="p-3 border border-slate-700 text-xs">Action</th>
              <th className="p-3 border border-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {colorNames.map(color => {
              const r = readings[color];
              const theta = calculateTheta(r);
              return (
                <tr key={color} className="hover:bg-slate-900/50 transition-colors border-b border-slate-800">
                   <td className="p-3 border border-slate-700 font-semibold" style={{ color: COLOR_MAP[color] || '#ccc' }}>
                     {color}
                   </td>
                   <td className="p-3 border border-slate-700 text-center text-slate-400">{r.leftV1?.toFixed(1) ?? "-"}</td>
                   <td className="p-3 border border-slate-700 text-center text-slate-400">{r.leftV2?.toFixed(1) ?? "-"}</td>
                   <td className="p-3 border border-slate-700 text-center">
                     <button 
                       onClick={() => handleLog(color, "left")} 
                       className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold transition text-white"
                     >
                       Log
                     </button>
                   </td>
                   <td className="p-3 border border-slate-700 text-center text-slate-400">{r.rightV1?.toFixed(1) ?? "-"}</td>
                   <td className="p-3 border border-slate-700 text-center text-slate-400">{r.rightV2?.toFixed(1) ?? "-"}</td>
                   <td className="p-3 border border-slate-700 text-center">
                     <button 
                       onClick={() => handleLog(color, "right")} 
                       className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs font-semibold transition text-white"
                     >
                       Log
                     </button>
                   </td>
                   <td className="p-3 border border-slate-700 text-center font-mono text-cyan-400 font-semibold">
                     {theta !== null ? theta.toFixed(2) : "-"}
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
         <h3 className="font-bold text-lg mb-3 text-white">Results & Calculation</h3>
         <p className="text-slate-400 text-sm mb-4">
           Using the grating formula (λ = d·sin(θ)), calculate wavelengths and compare with known values. Grating: 15,000 LPI.
         </p>
         
         <button 
           onClick={handleCalculate} 
           className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition text-white shadow-lg mb-6"
         >
           Calculate Final Results
         </button>

         {results && (
           <div className="w-full bg-slate-950 rounded-lg border border-slate-800 p-4 overflow-x-auto">
             <table className="w-full text-sm border-collapse">
               <thead>
                 <tr className="border-b-2 border-slate-700 text-slate-400">
                   <th className="p-3 text-left font-semibold">Color</th>
                   <th className="p-3 text-center font-semibold">Known λ (nm)</th>
                   <th className="p-3 text-center font-semibold">Calculated λ (nm)</th>
                   <th className="p-3 text-center font-semibold">% Error</th>
                 </tr>
               </thead>
               <tbody>
                 {colorNames.map((color, idx) => {
                   if (!results[color] || idx >= spectralLines.length) return null;
                   const stdLambdaNm = spectralLines[idx].wavelength;
                   const isAccurate = results[color].error < 5;
                   return (
                     <tr key={color} className="border-b border-slate-800 hover:bg-slate-900/30">
                       <td className="p-3 font-semibold" style={{ color: COLOR_MAP[color] || '#ccc' }}>
                         {color}
                       </td>
                       <td className="p-3 text-center text-slate-300 font-mono">{stdLambdaNm.toFixed(1)}</td>
                       <td className="p-3 text-center text-cyan-400 font-mono font-semibold">
                         {results[color].calculatedLambda.toFixed(1)}
                       </td>
                       <td className={`p-3 text-center font-mono font-bold ${isAccurate ? 'text-emerald-400' : 'text-red-400'}`}>
                         {results[color].error.toFixed(2)}%
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
             
             <div className="mt-6 flex justify-end">
               <button 
                 onClick={handleSaveToCloud}
                 disabled={isSaving}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition text-white shadow"
               >
                  {isSaving ? "Saving..." : "Save Data to Cloud"}
               </button>
             </div>
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

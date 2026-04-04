'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNumericalAperture } from '@/features/optics/hooks/useNumericalAperture';
import { ObservationTable } from '@/features/observation/components/ObservationTable';
import { Target, Database, X } from 'lucide-react';
import MainStage from "@/components/layout/MainStage";

type NALogReading = {
  distanceD: number;
  measuredDiameter: number;
  [key: string]: string | number; // generic row mapping
};

export default function NumericalApertureExperiment() {
  const {
    distanceMm,
    setDistanceMm,
    caliperLeftMm,
    setCaliperLeftMm,
    caliperRightMm,
    setCaliperRightMm,
    metrics
  } = useNumericalAperture();

  const [readings, setReadings] = useState<NALogReading[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const GRID_SIZE_MM = 40; 
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const pixelsPerMm = width / GRID_SIZE_MM;

    // Deep Dark Canvas Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Engineered Grid System
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += pixelsPerMm) {
      ctx.strokeStyle = (Math.round(x) % (pixelsPerMm * 5) === 0) ? '#1e293b' : '#0f172a';
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += pixelsPerMm) {
      ctx.strokeStyle = (Math.round(y) % (pixelsPerMm * 5) === 0) ? '#1e293b' : '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Origin Axes
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.stroke();

    const spotRadiusPx = metrics.radiusMm * pixelsPerMm;
    
    // Core laser spot with glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, spotRadiusPx * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ef4444';
    ctx.fill();

    // Diffraction Ring
    const gradient = ctx.createRadialGradient(centerX, centerY, spotRadiusPx * 0.8, centerX, centerY, spotRadiusPx * 1.3);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, spotRadiusPx * 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // High-Precision Calipers
    const caliperLeftPx = centerX + (caliperLeftMm * pixelsPerMm);
    const caliperRightPx = centerX + (caliperRightMm * pixelsPerMm);
    
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(caliperLeftPx, 0); ctx.lineTo(caliperLeftPx, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(caliperRightPx, 0); ctx.lineTo(caliperRightPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance Label on Canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(width - 140, 20, 120, 40);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.strokeRect(width - 140, 20, 120, 40);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.fillText(`Φ: ${Math.abs(caliperRightMm - caliperLeftMm).toFixed(2)}mm`, width - 125, 45);

  }, [metrics.radiusMm, caliperLeftMm, caliperRightMm]);

  const currentMeasuredDiameter = Math.abs(caliperRightMm - caliperLeftMm);

  const handleRecord = () => {
    setReadings(prev => {
      const filtered = prev.filter(p => p.distanceD !== distanceMm);
      return [...filtered, {
        distanceD: distanceMm,
        measuredDiameter: currentMeasuredDiameter,
      }].sort((a,b) => a.distanceD - b.distanceD);
    });
  };

  return (
    <MainStage 
      title="Numerical Aperture Experiment" 
      description="Measure the light-gathering capability of an optical fiber by analyzing its acceptance cone and diffraction patterns."
    >
      <div className="relative w-full h-[750px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/20 flex flex-col lg:flex-row">
         
         {/* Main Simulation Viewport */}
         <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-12 overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-slate-900">
               <canvas 
                 ref={canvasRef}
                 width={600}
                 height={600}
                 className="w-full h-full object-cover cursor-crosshair group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent" />
            </div>

            {/* Floating Overlays */}
            {!isLogOpen && (
              <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
                  <button 
                    onClick={() => setIsLogOpen(true)}
                    className="px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:bg-slate-800 text-slate-300 text-[13px] font-bold rounded-2xl transition-all shadow-xl flex items-center gap-3 active:scale-95"
                  >
                    <Database className="w-4 h-4 text-blue-400" />
                    Telemetry Data
                    {readings.length > 0 && (
                      <span className="ml-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">{readings.length}</span>
                    )}
                  </button>
              </div>
            )}
         </div>

         {/* Control Panel Sidebar */}
         <div className="w-full lg:w-[420px] bg-slate-900/40 border-l border-slate-800 p-10 flex flex-col gap-10 backdrop-blur-xl">
            
            <div className="space-y-8">
               
               {/* Distance Config */}
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Projection Distance ($d$)</h4>
                     <span className="text-2xl font-black text-red-500 font-mono tracking-tight">{distanceMm.toFixed(1)} <span className="text-xs text-slate-600 font-bold">mm</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="5.0" 
                    max="30.0" 
                    step="0.5"
                    value={distanceMm} 
                    onChange={(e) => setDistanceMm(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold px-1">
                     <span>5.0 mm</span>
                     <span>Optimal Range</span>
                     <span>30.0 mm</span>
                  </div>
               </div>

               {/* Caliper Controls */}
               <div className="pt-8 border-t border-slate-800 space-y-8">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Target className="w-4 h-4 text-blue-400" /> Precision Calipers
                  </h4>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex justify-between text-[13px] font-bold">
                           <span className="text-slate-400">Left Jaw Position</span>
                           <span className="text-blue-400 font-mono">{caliperLeftMm.toFixed(2)} mm</span>
                        </div>
                        <input 
                          type="range" 
                          min="-20.0" 
                          max="0.0" 
                          step="0.05"
                          value={caliperLeftMm} 
                          onChange={(e) => setCaliperLeftMm(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                        />
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between text-[13px] font-bold">
                           <span className="text-slate-400">Right Jaw Position</span>
                           <span className="text-blue-400 font-mono">{caliperRightMm.toFixed(2)} mm</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.0" 
                          max="20.0" 
                          step="0.05"
                          value={caliperRightMm} 
                          onChange={(e) => setCaliperRightMm(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-auto space-y-4">
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center transition-all hover:border-blue-500/30">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Calculated N.A.</span>
                  <span className="text-xl font-black text-white font-mono">{metrics.numericalAperture.toFixed(4)}</span>
               </div>
               
               <button 
                  onClick={handleRecord}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
               >
                  Record Measurement
               </button>
            </div>

         </div>

         {/* Slide-out Observation Table */}
         <div 
            className={`absolute top-0 right-0 h-full z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLogOpen ? 'translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]' : 'translate-x-[110%]'
            }`}
         >
            <ObservationTable 
               title="Aperture Dataset"
               columns={[
                 { key: 'distanceD', label: 'Distance (d)', unit: 'mm' },
                 { key: 'measuredDiameter', label: 'Diameter (D)', unit: 'mm' }
               ]}
               data={readings}
               onClose={() => setIsLogOpen(false)}
               onSaveToFirebase={async () => new Promise(res => setTimeout(res, 500))} 
            />
         </div>

      </div>
    </MainStage>
  );
}

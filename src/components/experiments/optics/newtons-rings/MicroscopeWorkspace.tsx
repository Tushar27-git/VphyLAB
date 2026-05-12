"use client";

import React, { useRef, useState } from "react";

interface MicroscopeWorkspaceProps {
  lampOn: boolean;
  setLampOn: (v: boolean) => void;
  microscopePosition: number;
  setMicroscopePosition: (v: number) => void;
  zoomLevel: number;
  setZoomLevel: (v: number) => void;
}

export function MicroscopeWorkspace({ lampOn, setLampOn, microscopePosition, setMicroscopePosition, zoomLevel, setZoomLevel }: MicroscopeWorkspaceProps) {

  const railRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ mode: 'x' | 'y', x: number, y: number, initPos: number, initZoom: number } | null>(null);

  // Range mappings for microscope UI positioning
  const minPos = 0;
  const maxPos = 50;
  const centerPos = 25;
  
  // Let's say +/- 25mm translates to +/- 150px movement visually
  const translationX = ((microscopePosition - centerPos) / 25) * 150;
  
  // Vertical focus translation relative to arm anchor
  const translationY = (zoomLevel - 100) * 0.4;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, mode: 'x' | 'y') => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragState({ mode, x: e.clientX, y: e.clientY, initPos: microscopePosition, initZoom: zoomLevel });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState) return;
    
    if (dragState.mode === 'x') {
      const deltaX = e.clientX - dragState.x;
      // 150px visual offset = 25mm mechanical offset -> 1mm = 6px displacement
      let newPos = dragState.initPos + (deltaX / 6);
      newPos = Math.max(minPos, Math.min(maxPos, newPos));
      setMicroscopePosition(Number(newPos.toFixed(2))); // Snap to precision
    } else if (dragState.mode === 'y') {
      const deltaY = e.clientY - dragState.y;
      // 1 zoom unit visually mapped roughly to 1px down
      let newZoom = dragState.initZoom + (deltaY * 1.5);
      newZoom = Math.max(20, Math.min(200, Math.round(newZoom)));
      setZoomLevel(newZoom);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragState(null);
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950 relative flex items-center justify-center pt-16">
      
      {/* Background Lighting Glow (If Lamp On) */}
      {lampOn && (
         <div className="absolute left-[20%] top-1/2 -translate-y-[80%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      )}

      <div className="relative w-full h-[400px] max-w-2xl flex items-center">
        
        {/* Sodium Lamp (Left) */}
        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 z-10">
           <div className="w-16 h-24 bg-slate-800 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-end pb-2 shadow-2xl cursor-pointer hover:border-slate-500 transition-colors" onClick={() => setLampOn(!lampOn)}>
              {/* Bulb */}
              <div className={`w-10 h-10 rounded-full mb-1 transition-all duration-300 ${lampOn ? 'bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)] border border-amber-200' : 'bg-slate-600 border border-slate-500'}`}></div>
              <div className="w-6 h-4 bg-slate-700 rounded-sm"></div>
              {/* Switch label */}
              <div className="mt-2 text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                {lampOn ? 'ON' : 'OFF'}
              </div>
           </div>
           {/* Beam Ray Simulation */}
           {lampOn && (
             <div className="absolute left-16 top-1/2 -translate-y-1/2 h-16 w-32 bg-gradient-to-r from-amber-400/30 to-transparent pointer-events-none"></div>
           )}
        </div>

        {/* Central Newton's Ring Setup */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-8 w-48 h-32 flex flex-col items-center border-b-8 border-slate-800">
           
           {/* 45 Degree Glass Plate */}
           <div className="absolute top-0 w-32 h-[4px] bg-cyan-400/40 border border-cyan-300/30 rotate-45 rounded shadow-[0_4px_10px_rgba(34,211,238,0.2)]"></div>
           {/* Light interaction */}
           {lampOn && (
            <>
              {/* Reflection down from plate */}
              <div className="absolute top-[16px] w-[2px] h-16 bg-gradient-to-b from-amber-400/50 to-amber-500/10"></div>
              {/* Reflection up from plate to microscope */}
              <div className="absolute -top-[60px] w-[2px] h-[60px] bg-gradient-to-t from-amber-400/30 to-amber-500/0"></div>
            </>
           )}

           {/* Plano Convex Lens and Flat Glass Below It */}
           <div className="absolute bottom-[2px] w-24 h-12 flex flex-col items-center justify-end">
             {/* Plano Convex Lens */}
             <div className="w-20 h-6 bg-cyan-500/20 border-t border-r border-l border-cyan-400/40 rounded-b-[100px] backdrop-blur-sm z-10" />
             {/* Flat Plate */}
             <div className="w-24 h-2 bg-cyan-600/30 border border-cyan-500/30 rounded-sm mt-0.5 backdrop-blur-sm" />
           </div>
        </div>

        {/* Travelling Microscope Assembly (Top) */}
        <div 
          ref={railRef}
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg h-24 border-b-4 border-slate-700/80"
        >
          
          {/* Main Microscope Arm Container */}
          <div 
             className={`absolute bottom-0 left-1/2 w-48 h-64 flex flex-col items-center z-30 ${dragState ? "" : "transition-transform duration-100 will-change-transform"}`}
             style={{ transform: `translate(calc(-50% + ${translationX}px), ${translationY}px)` }}
          >
             {/* Eyepiece / Tube (Controls Y Zoom) */}
             <div 
                className={`w-12 h-32 bg-slate-800 border-2 border-slate-600 rounded-t-lg shadow-xl relative flex flex-col items-center z-10 cursor-ns-resize hover:border-slate-500 transition-colors ${dragState?.mode === 'y' ? "border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]" : ""}`}
                onPointerDown={(e) => handlePointerDown(e, 'y')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
             >
               {/* Eyepiece rubber */}
               <div className="w-14 h-4 bg-slate-900 border-2 border-slate-700 rounded-t-sm -mt-4 shadow-black shadow-md pointer-events-none"></div>
               {/* Objective lens */}
               <div className="w-8 h-6 bg-slate-800 border-[3px] border-slate-600 rounded-b-md absolute bottom-[-6px] pointer-events-none"></div>
             </div>
             
             {/* Vernier scale mount block (Controls X Position) */}
             <div 
                className={`absolute bottom-0 w-32 h-10 bg-slate-700 border-2 border-slate-500 shadow-lg rounded flex items-center justify-center cursor-ew-resize hover:border-slate-400 transition-colors ${dragState?.mode === 'x' ? "border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" : ""}`}
                onPointerDown={(e) => handlePointerDown(e, 'x')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
             >
               {/* Tiny vernier hash marks decoration */}
               <div className="flex gap-[3px] pointer-events-none">
                 {[...Array(15)].map((_, i) => <div key={i} className="w-[1px] h-4 bg-slate-400/50"></div>)}
               </div>
             </div>
          </div>

          {/* Slider Rail decoration */}
          <div className="absolute bottom-1 w-full flex justify-between px-4">
             {[...Array(51)].map((_, i) => (
                <div key={i} className={`w-[1px] ${i % 10 === 0 ? 'h-4 bg-slate-400' : 'h-2 bg-slate-600'}`}></div>
             ))}
          </div>
        </div>
        
      </div>

      {/* Micrometer Screw Gauge & Focus Controls (Bottom) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl flex flex-col gap-2">
        
        {/* Row 1: X-Axis Horizontal Rail Control */}
        <div className="bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-xl shadow-2xl backdrop-blur flex items-center gap-4">
          <span className="text-slate-300 font-semibold whitespace-nowrap text-xs w-28 text-right">Translation [X]</span>
          <div className="flex-1 flex items-center gap-2">
              <button 
                className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shadow text-xs"
                onClick={() => setMicroscopePosition(Math.max(minPos, microscopePosition - 0.01))}
              >‹</button>
              <input 
                type="range" min={minPos} max={maxPos} step="0.01" 
                value={microscopePosition} 
                onChange={e => setMicroscopePosition(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-blue-500 hover:accent-blue-400 transition"
              />
              <button 
                className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shadow text-xs"
                onClick={() => setMicroscopePosition(Math.min(maxPos, microscopePosition + 0.01))}
              >›</button>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-blue-400 font-bold min-w-[85px] text-center shadow-inner text-sm">
             {microscopePosition.toFixed(2)} mm
          </div>
        </div>

        {/* Row 2: Z-Axis Vertical Focus / Zoom Control */}
        <div className="bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-xl shadow-2xl backdrop-blur flex items-center gap-4">
          <span className="text-slate-300 font-semibold whitespace-nowrap text-xs w-28 text-right">Focal Zoom [Y]</span>
          <div className="flex-1 flex items-center gap-2">
              <button 
                className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shadow text-xs"
                onClick={() => setZoomLevel(Math.max(20, zoomLevel - 1))}
              >‹</button>
              <input 
                type="range" min={20} max={200} step="1" 
                value={zoomLevel} 
                onChange={e => setZoomLevel(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-ns-resize accent-teal-500 hover:accent-teal-400 transition"
              />
              <button 
                className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shadow text-xs"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 1))}
              >›</button>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-teal-400 font-bold min-w-[85px] text-center shadow-inner text-sm">
             X{zoomLevel}
          </div>
        </div>

      </div>

    </div>
  );
}

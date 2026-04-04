'use client';

import React from 'react';
import { Database, Plus, UploadCloud, X } from 'lucide-react';

export type TableColumn = {
  key: string;
  label: string;
  unit?: string;
};

export type TableRowData = Record<string, string | number>;

interface ObservationTableProps {
  title: string;
  columns: TableColumn[];
  data: TableRowData[];
  onAddRow?: () => void;
  addRowLabel?: string;
  isSaving?: boolean;
  onSaveToFirebase: () => Promise<void>;
  onClose?: () => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  title,
  columns,
  data,
  onAddRow,
  addRowLabel = "Append Reading",
  isSaving = false,
  onSaveToFirebase,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-[400px] flex-shrink-0 z-50 shadow-2xl relative">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          {title}
        </h3>
        <div className="flex items-center gap-4">
           <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
             {data.length} logs
           </span>
           {onClose && (
             <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>
      
      {/* Table Body */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden shadow-inner">
          <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-4 py-4 font-mono">Run</th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-4 whitespace-nowrap">
                  {col.label} {col.unit && <span className="lowercase normal-case font-normal ml-1 text-slate-500">({col.unit})</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-16 text-slate-500 text-sm font-medium italic">
                  Awaiting sensor input...
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group last:border-0">
                  <td className="px-4 py-3 border-r border-slate-700/50 font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {(idx + 1).toString().padStart(2, '0')}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 font-mono text-[13px] text-slate-200 font-semibold">
                      {row[col.key] === null || row[col.key] === undefined 
                        ? <span className="text-slate-600">-</span> 
                        : typeof row[col.key] === 'number' 
                           ? (row[col.key] as number).toFixed(3) 
                           : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-slate-800 bg-slate-900 flex flex-col gap-3">
        {onAddRow && (
          <button
            onClick={onAddRow}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border border-violet-500/50 text-white rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-lg"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            {addRowLabel}
          </button>
        )}
        
        <button
          onClick={onSaveToFirebase}
          disabled={isSaving || data.length === 0}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed active:scale-[0.98] flex justify-center items-center gap-2 shadow-sm"
        >
          {isSaving ? (
             <span className="flex items-center gap-2 text-cyan-400">
               <UploadCloud className="w-4 h-4 animate-bounce" /> Syncing...
             </span>
          ) : (
            <><UploadCloud className="w-4 h-4 text-slate-400" /> Save to Cloud Storage</>
          )}
        </button>
      </div>
    </div>
  );
};

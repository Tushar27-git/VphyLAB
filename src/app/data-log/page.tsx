'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Download,
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  getRecentLogs,
  exportToCSV,
  type ExperimentLog,
} from '@/lib/lib/firebase/experiments';
import { PortalLayout } from '@/components/layout/PortalLayout';

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} // ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function DataLogPage() {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');
  const [selectedLog, setSelectedLog] = useState<ExperimentLog | null>(null);

  const fetchLogs = () => {
    setIsLoading(true);
    getRecentLogs(50)
      .then((data) => {
        setLogs(data);
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setLogs([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      const matchesSearch =
        !searchFilter.trim() ||
        log.experimentName.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
        (log.sessionId && log.sessionId.toLowerCase().includes(searchFilter.toLowerCase().trim()));
      return matchesStatus && matchesSearch;
    });
  }, [logs, searchFilter, statusFilter]);

  const totalPoints = useMemo(() => {
    return logs.reduce((sum, l) => sum + (l.data?.length || 0), 0);
  }, [logs]);

  const handleBulkExport = () => {
    if (filteredLogs.length === 0) return;
    // Combine all data across filtered logs into summary csv
    const allRows: any[] = [];
    filteredLogs.forEach((log) => {
      if (log.data && Array.isArray(log.data)) {
        log.data.forEach((row) => {
          allRows.push({
            session_id: log.sessionId,
            experiment: log.experimentName,
            status: log.status,
            ...row,
          });
        });
      }
    });
    if (allRows.length > 0) {
      exportToCSV('GTBIT_Bulk_DataLog', allRows);
    }
  };

  return (
    <PortalLayout searchPlaceholder="Filter logs by experiment, session ID...">
      <div className="space-y-10">
        {/* Hero Banner */}
        <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-[var(--font-space-grotesk)] uppercase tracking-wider mb-3 font-bold">
                <Database className="w-3.5 h-3.5" />
                <span>Central Repository</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 font-[var(--font-public-sans)] tracking-tight">
                Experimental Data Log & Export Center
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Review, inspect, and export all recorded measurements logged during student and researcher simulation runs. Data is automatically timestamped and synced with cloud servers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <button
                onClick={fetchLogs}
                disabled={isLoading}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-[var(--font-space-grotesk)] uppercase tracking-wider rounded-xl border border-white/10 flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
                <span>Refresh Logs</span>
              </button>
              <button
                onClick={handleBulkExport}
                disabled={filteredLogs.length === 0}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 text-xs font-black font-[var(--font-space-grotesk)] uppercase tracking-wider rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Bulk Export CSV</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0F172A] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="text-xs font-[var(--font-space-grotesk)] text-slate-400 uppercase font-bold tracking-wider">
                Total Sessions
              </div>
              <div className="text-2xl font-black text-slate-100 font-[var(--font-public-sans)] mt-0.5">
                {isLoading ? '...' : logs.length}
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-[var(--font-space-grotesk)] text-slate-400 uppercase font-bold tracking-wider">
                Completed Sessions
              </div>
              <div className="text-2xl font-black text-slate-100 font-[var(--font-public-sans)] mt-0.5">
                {isLoading ? '...' : logs.filter((l) => l.status === 'COMPLETED').length}
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-[var(--font-space-grotesk)] text-slate-400 uppercase font-bold tracking-wider">
                Total Data Points
              </div>
              <div className="text-2xl font-black text-slate-100 font-[var(--font-public-sans)] mt-0.5">
                {isLoading ? '...' : totalPoints}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by experiment name or session ID..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 transition font-[var(--font-space-grotesk)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-[var(--font-space-grotesk)] uppercase font-bold mr-1">Status:</span>
            {(['ALL', 'COMPLETED', 'IN_PROGRESS'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-[var(--font-space-grotesk)] font-bold uppercase tracking-wider transition ${
                  statusFilter === st
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </section>

        {/* Data Log Table */}
        <section className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
            <h2 className="text-base font-[var(--font-public-sans)] font-bold text-slate-100">
              Synchronized Log Records
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredLogs.length} of {logs.length} entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/50">
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Experiment Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Session ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Data Rows
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-[var(--font-space-grotesk)] uppercase tracking-widest text-slate-400 font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                        <span className="text-xs font-[var(--font-space-grotesk)] tracking-wider uppercase">Loading records from cloud storage...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500 italic text-sm">
                      No logs match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, i) => (
                    <tr key={log.id || i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 text-slate-300 font-[var(--font-space-grotesk)] text-xs font-mono">
                        {formatTimestamp(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-100 font-bold text-sm">
                        {log.experimentName}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-[var(--font-space-grotesk)] text-xs font-mono">
                        {log.sessionId}
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold text-teal-400">
                          {log.data?.length || 0} pts
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            log.status === 'COMPLETED'
                              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'COMPLETED' ? 'bg-teal-400' : 'bg-amber-400'
                            }`}
                          />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-xs font-[var(--font-space-grotesk)] text-slate-300 hover:text-white px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => exportToCSV(log.experimentName, log.data)}
                            className="text-teal-400 hover:text-teal-300 font-[var(--font-space-grotesk)] text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>CSV</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Inspect Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-[var(--font-public-sans)]">
                    Inspection: {selectedLog.experimentName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Session: {selectedLog.sessionId}</p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold font-[var(--font-space-grotesk)]"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                  <div className="text-xs font-[var(--font-space-grotesk)] uppercase text-slate-400 mb-2 font-bold">
                    Observation Readings ({selectedLog.data?.length || 0} rows)
                  </div>
                  {selectedLog.data && selectedLog.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400">
                            {Object.keys(selectedLog.data[0]).map((key) => (
                              <th key={key} className="py-2 px-3 uppercase tracking-wider">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                          {selectedLog.data.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              {Object.values(row).map((val: any, colIdx: number) => (
                                <td key={colIdx} className="py-2 px-3">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No tabular observations captured in this session log.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-4">
                <button
                  onClick={() => exportToCSV(selectedLog.experimentName, selectedLog.data)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 font-[var(--font-space-grotesk)] shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export This Session CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

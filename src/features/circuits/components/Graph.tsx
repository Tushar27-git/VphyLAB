import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface GraphData {
  time: number;
  voltage: number;
}

interface GraphProps {
  data: GraphData[];
  theoreticalData: GraphData[];
  title: string;
}

export function Graph({ data, theoreticalData, title }: GraphProps) {
  const combinedData = [...data];
  
  // Merge theoretical data for display
  theoreticalData.forEach(theo => {
    if (!combinedData.find(d => Math.abs(d.time - theo.time) < 0.1)) {
      combinedData.push(theo);
    }
  });

  combinedData.sort((a, b) => a.time - b.time);

  const chartData = combinedData.map(d => ({
    time: parseFloat(d.time.toFixed(2)),
    experimental: data.find(exp => Math.abs(exp.time - d.time) < 0.1)?.voltage,
    theoretical: theoreticalData.find(theo => Math.abs(theo.time - d.time) < 0.1)?.voltage,
  }));

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>

      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4" style={{ height: '400px' }}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
            No data to display. Record observations to generate graph.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="time"
                type="number"
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, style: { fill: '#64748b' } }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />
              <YAxis
                domain={[0, 5.5]}
                label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Legend />
              {data.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="experimental"
                  stroke="#3b82f6"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Experimental Data"
                  isAnimationActive={false}
                />
              )}
              {theoreticalData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="theoretical"
                  stroke="#8b5cf6"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Theoretical Curve"
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

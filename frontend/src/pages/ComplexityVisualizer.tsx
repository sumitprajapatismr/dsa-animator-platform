import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Activity, Code } from 'lucide-react';

const ComplexityVisualizer: React.FC = () => {
  const [maxN, setMaxN] = useState(30);

  // Generate math data points for complexity curves
  const data = Array.from({ length: maxN - 1 }, (_, i) => {
    const n = i + 2;
    return {
      n,
      'O(1)': 1,
      'O(log N)': Math.round(Math.log2(n) * 10) / 10,
      'O(N)': n,
      'O(N log N)': Math.round(n * Math.log2(n) * 10) / 10,
      'O(N^2)': n * n
    };
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Complexity Visualizer</h1>
        <p className="mt-2 text-sm text-gray-400">Interact with mathematical complexity curves and see how execution operations scale relative to input dimensions.</p>
      </div>

      {/* Controller */}
      <div className="p-4 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold">Adjust Input Bounds (N):</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={maxN}
            onChange={(e) => setMaxN(Number(e.target.value))}
            className="accent-indigo-600 h-1 bg-gray-800 rounded"
          />
          <span className="text-xs font-mono font-bold text-indigo-400">{maxN} Elements</span>
        </div>
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow h-[420px]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Complexity Growth Functions</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23324C" />
                <XAxis dataKey="n" stroke="#4B5563" fontSize={11} label={{ value: 'Input Size (N)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis stroke="#4B5563" fontSize={11} label={{ value: 'Operations (T)', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ backgroundColor: '#161F30', borderColor: '#23324C', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="O(1)" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="O(log N)" stroke="#06B6D4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="O(N)" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="O(N log N)" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="O(N^2)" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readout stats cards */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Operations at N={maxN}</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded bg-[#111A2C] border border-brand-border/40">
                <span className="text-green-400 font-bold">O(1)</span>
                <span className="font-bold">1 ops</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#111A2C] border border-brand-border/40">
                <span className="text-cyan-400 font-bold">O(log N)</span>
                <span className="font-bold">{Math.round(Math.log2(maxN) * 10) / 10} ops</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#111A2C] border border-brand-border/40">
                <span className="text-blue-400 font-bold">O(N)</span>
                <span className="font-bold">{maxN} ops</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#111A2C] border border-brand-border/40">
                <span className="text-purple-400 font-bold">O(N log N)</span>
                <span className="font-bold">{Math.round(maxN * Math.log2(maxN))} ops</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-[#111A2C] border border-brand-border/40">
                <span className="text-red-400 font-bold">O(N^2)</span>
                <span className="font-bold">{maxN * maxN} ops</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-brand-dark border border-brand-border/40 flex gap-2">
            <Code className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              **Pro Tip:** Avoid O(N^2) quadratic algorithms when input N exceed $10^4$ to prevent runtime execution timeouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityVisualizer;


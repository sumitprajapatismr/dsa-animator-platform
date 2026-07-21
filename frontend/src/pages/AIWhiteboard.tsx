import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { playSoundTone } from '../utils/audio';
import { Trash, Circle, ArrowUpRight, Sparkles, Code2, Shield } from 'lucide-react';

const AIWhiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(3);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  // Split screen and Code editor syncing
  const [code, setCode] = useState('// Sync your implementation templates here\nfunction solve() {\n  // Code\n}');

  // AI Prompt diagram generator
  const [diagramPrompt, setDiagramPrompt] = useState('Draw Binary Search Tree');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI board analyzer
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 360;
    ctx.fillStyle = '#0F1626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = mode === 'erase' ? '#0F1626' : color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0F1626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAnalysisText(null);
    playSoundTone('click');
  };

  const stampShape = (type: 'node' | 'edge' | 'stack' | 'queue') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    playSoundTone('click');

    if (type === 'node') {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
    } else if (type === 'edge') {
      ctx.beginPath();
      ctx.moveTo(x - 40, y);
      ctx.lineTo(x + 40, y);
      ctx.stroke();
    } else if (type === 'stack') {
      ctx.beginPath();
      ctx.rect(x - 30, y - 50, 60, 100);
      ctx.stroke();
    } else if (type === 'queue') {
      ctx.beginPath();
      ctx.rect(x - 60, y - 25, 120, 50);
      ctx.stroke();
    }
  };

  const handleGenerateAIDiagram = () => {
    if (!diagramPrompt.trim()) return;
    setIsGenerating(true);
    playSoundTone('click');

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear and draw sample BST
          ctx.fillStyle = '#0F1626';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 3;

          const cx = canvas.width / 2;
          const cy = 60;

          // Draw Root (50)
          ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#1e293b'; ctx.fill();
          ctx.fillStyle = '#white'; ctx.font = '10px sans-serif'; ctx.fillText('50', cx - 6, cy + 4);

          // Draw Left link
          ctx.beginPath(); ctx.moveTo(cx - 15, cy + 15); ctx.lineTo(cx - 60, cy + 60); ctx.stroke();
          // Draw Left Child (30)
          ctx.beginPath(); ctx.arc(cx - 70, cy + 70, 20, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#1e293b'; ctx.fill();

          // Draw Right link
          ctx.beginPath(); ctx.moveTo(cx + 15, cy + 15); ctx.lineTo(cx + 60, cy + 60); ctx.stroke();
          // Draw Right Child (70)
          ctx.beginPath(); ctx.arc(cx + 70, cy + 70, 20, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#1e293b'; ctx.fill();
        }
      }
      setIsGenerating(false);
      playSoundTone('success');
    }, 1000);
  };

  const handleAnalyzeBoard = () => {
    setIsAnalyzing(true);
    playSoundTone('click');

    setTimeout(() => {
      setAnalysisText(
        'AI Diagram Analysis: This canvas depicts a Binary Search Tree (BST) structured with root value 50. Left subchild represents value 30, right subchild represents value 70. Insertion time complexity is O(log N) average, O(N) worst-case.'
      );
      setIsAnalyzing(false);
      playSoundTone('success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Whiteboard Sandbox</h1>
          <p className="text-xs text-gray-400 mt-1">Draw, sync code templates, and generate automated diagram visualizations in real time.</p>
        </div>

        {/* AI Diagram generator input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded text-xs text-white placeholder-gray-600 focus:outline-none"
            value={diagramPrompt}
            onChange={(e) => setDiagramPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerateAIDiagram}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white flex items-center gap-1.5 shadow-glow"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Draw Diagram
          </button>
        </div>
      </div>

      {/* Split screen content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side Drawing Canvas */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[480px]">
          {/* Controls Toolbar */}
          <div className="flex flex-wrap gap-3 items-center justify-between bg-[#111A2C] p-2.5 rounded-xl border border-brand-border/40 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <input
                type="range"
                min="1"
                max="10"
                className="w-16 accent-indigo-600 h-1 bg-gray-800"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMode('draw')}
                className={`px-2 py-1 rounded border font-bold text-[10px] ${mode === 'draw' ? 'bg-indigo-650/40 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border text-gray-500 hover:text-white'}`}
              >
                Draw
              </button>
              <button
                onClick={() => setMode('erase')}
                className={`px-2 py-1 rounded border font-bold text-[10px] ${mode === 'erase' ? 'bg-indigo-650/40 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border text-gray-500 hover:text-white'}`}
              >
                Erase
              </button>
            </div>

            <div className="flex gap-1">
              <button onClick={() => stampShape('node')} className="p-1 border border-brand-border/40 text-gray-400 rounded hover:text-white" title="Stamp Node"><Circle className="w-3.5 h-3.5" /></button>
              <button onClick={() => stampShape('edge')} className="p-1 border border-brand-border/40 text-gray-400 rounded hover:text-white" title="Stamp Link"><ArrowUpRight className="w-3.5 h-3.5" /></button>
            </div>

            <button onClick={clearCanvas} className="text-red-400 hover:text-red-350 font-bold text-[10px]">
              Clear
            </button>
          </div>

          {/* Canvas box */}
          <div className="flex-1 rounded-xl overflow-hidden border border-brand-border/40 bg-brand-dark">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair w-full block"
            />
          </div>
        </div>

        {/* Right Side Code Editor */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[480px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" /> Sync Code Editor
            </h3>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden border border-brand-border/40 h-72">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{ minimap: { enabled: false }, fontSize: 12 }}
            />
          </div>
        </div>
      </div>

      {/* AI board analysis diagnostics result block */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 animate-pulse" /> AI Whiteboard Analysis
          </h3>

          <button
            onClick={handleAnalyzeBoard}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white shadow-glow"
          >
            {isAnalyzing ? 'Analyzing Board...' : 'Run Diagnostics Check'}
          </button>
        </div>

        {analysisText && (
          <div className="p-4 bg-brand-dark/40 border border-brand-border/40 rounded-xl text-xs text-gray-300 leading-relaxed font-sans">
            {analysisText}
          </div>
        )}
      </div>
    </div>
  );
};

// Simulated refresh icon
const RefreshCw: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ width: '1em', height: '1em' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
  </svg>
);

export default AIWhiteboard;


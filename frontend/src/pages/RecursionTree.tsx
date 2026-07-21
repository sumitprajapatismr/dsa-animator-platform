import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface CallNode {
  name: string;
  val: number;
  left: CallNode | null;
  right: CallNode | null;
}

const RecursionTree: React.FC = () => {
  const [num, setNum] = useState(4);
  const [treeRoot, setTreeRoot] = useState<CallNode | null>(null);
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [completedCalls, setCompletedCalls] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  // Helper: build recursion tree in memory
  const buildFibTree = (n: number, id: string = 'root'): CallNode => {
    if (n <= 1) {
      return { name: id, val: n, left: null, right: null };
    }
    return {
      name: id,
      val: n,
      left: buildFibTree(n - 1, `${id}-l`),
      right: buildFibTree(n - 2, `${id}-r`)
    };
  };

  const generateTree = () => {
    setAnimating(true);
    setCompletedCalls([]);
    setActiveCall(null);

    const root = buildFibTree(num);
    setTreeRoot(root);

    // Collect call order
    const list: string[] = [];
    const traverse = (node: CallNode | null) => {
      if (!node) return;
      list.push(node.name);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(root);

    // Animate execution
    let i = 0;
    const interval = setInterval(() => {
      if (i >= list.length) {
        setAnimating(false);
        setActiveCall(null);
        clearInterval(interval);
        return;
      }
      setActiveCall(list[i]);
      setCompletedCalls(prev => [...prev, list[i]]);
      i++;
    }, 800);
  };

  const renderCallTree = (node: CallNode | null, x: number, y: number, offset: number): React.ReactNode => {
    if (!node) return null;
    const elements: React.ReactNode[] = [];

    const isActive = activeCall === node.name;
    const isCompleted = completedCalls.includes(node.name);

    let circleColor = '#161F30';
    let strokeColor = '#23324C';
    if (isActive) { strokeColor = '#EC4899'; circleColor = 'rgba(236, 72, 153, 0.2)'; }
    else if (isCompleted) { strokeColor = '#6366F1'; circleColor = 'rgba(99, 102, 241, 0.2)'; }

    if (node.left) {
      elements.push(
        <line
          key={`line-l-${node.name}`}
          x1={x} y1={y}
          x2={x - offset} y2={y + 50}
          stroke="#23324C"
          strokeWidth="2"
        />
      );
      elements.push(renderCallTree(node.left, x - offset, y + 50, offset * 0.5));
    }

    if (node.right) {
      elements.push(
        <line
          key={`line-r-${node.name}`}
          x1={x} y1={y}
          x2={x + offset} y2={y + 50}
          stroke="#23324C"
          strokeWidth="2"
        />
      );
      elements.push(renderCallTree(node.right, x + offset, y + 50, offset * 0.5));
    }

    elements.push(
      <g key={`node-${node.name}`}>
        <circle
          cx={x} cy={y} r="16"
          fill={circleColor}
          stroke={strokeColor}
          strokeWidth="3"
        />
        <text
          x={x} y={y + 4}
          fill="white"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
        >
          {`F(${node.val})`}
        </text>
      </g>
    );

    return <g key={`g-${node.name}`}>{elements}</g>;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Recursion Tree Generator</h1>
        <p className="mt-2 text-sm text-gray-400">Animate Fibonacci call stacks. Watch how function subdivisions compile branches on execution runs.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500">Calculate fib(N) for N:</label>
          <select
            value={num}
            onChange={(e) => setNum(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-[#111A2C] border border-brand-border text-xs focus:outline-none focus:border-indigo-500 text-white"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateTree}
            disabled={animating}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-500 text-white shadow-glow disabled:opacity-40 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" /> Animate Stack
          </button>
          <button
            onClick={() => { setTreeRoot(null); setCompletedCalls([]); }}
            className="px-4 py-2 bg-[#111A2C] border border-brand-border text-xs font-semibold rounded-lg hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Canvas output */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow h-[420px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 right-4 text-xs font-bold uppercase px-3 py-1 bg-indigo-950/40 text-indigo-400 rounded-full border border-indigo-900/40">
          Recursion Stack View
        </div>

        {treeRoot ? (
          <svg className="w-full h-80 overflow-visible">
            {renderCallTree(treeRoot, 220, 30, 90)}
          </svg>
        ) : (
          <div className="text-xs text-gray-500">Select value and click Animate Stack to generate.</div>
        )}
      </div>
    </div>
  );
};

export default RecursionTree;


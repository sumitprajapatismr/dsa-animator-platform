import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, Plus } from 'lucide-react';

interface CustomNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface CustomEdge {
  from: string;
  to: string;
  weight: number;
}

const GraphPlayground: React.FC = () => {
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [algo, setAlgo] = useState<'bfs' | 'dfs'>('bfs');

  // Animation states
  const [visitedList, setVisitedList] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (animating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near an existing node (within 24px)
    const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 24);

    if (clickedNode) {
      if (selectedNodeId === null) {
        setSelectedNodeId(clickedNode.id);
      } else {
        if (selectedNodeId !== clickedNode.id) {
          // Connect edges
          const exists = edges.find(
            edge => (edge.from === selectedNodeId && edge.to === clickedNode.id) ||
                    (edge.from === clickedNode.id && edge.to === selectedNodeId)
          );
          if (!exists) {
            setEdges([...edges, { from: selectedNodeId, to: clickedNode.id, weight: Math.floor(Math.random() * 8) + 2 }]);
          }
        }
        setSelectedNodeId(null);
      }
    } else {
      // Spawn new node
      const char = String.fromCharCode(65 + nodes.length); // A, B, C...
      const newNode = { id: `node-${Date.now()}`, label: char, x, y };
      setNodes([...nodes, newNode]);
      setSelectedNodeId(null);
    }
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setVisitedList([]);
    setAnimating(false);
  };

  const startAnimation = () => {
    if (nodes.length === 0) return;
    setAnimating(true);
    setVisitedList([]);

    // Simple BFS traversal simulation
    const queue = [nodes[0].id];
    const visited: string[] = [];
    
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (!visited.includes(curr)) {
        visited.push(curr);
        // Find adjacent edges
        const neighbors = edges
          .filter(e => e.from === curr || e.to === curr)
          .map(e => e.from === curr ? e.to : e.from);
        
        neighbors.forEach(n => {
          if (!visited.includes(n) && !queue.includes(n)) {
            queue.push(n);
          }
        });
      }
    }

    // Step-by-step render
    let step = 0;
    const interval = setInterval(() => {
      if (step >= visited.length) {
        setAnimating(false);
        clearInterval(interval);
        return;
      }
      setVisitedList(prev => [...prev, visited[step]]);
      step++;
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Interactive Graph Playground</h1>
        <p className="mt-2 text-sm text-gray-400">Draw your own custom graph structures interactively. Click inside the canvas viewport below to create nodes and drag to link them.</p>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
        <div className="flex gap-3 items-center">
          <label className="text-xs text-gray-500">Traversal Algorithm:</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-[#111A2C] border border-brand-border text-xs focus:outline-none"
          >
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startAnimation}
            disabled={animating || nodes.length === 0}
            className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 shadow-glow disabled:opacity-35 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" /> Run Traversal
          </button>
          <button
            onClick={resetGraph}
            className="px-4 py-2.5 bg-[#111A2C] border border-brand-border text-xs font-semibold rounded-lg hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Clear Canvas
          </button>
        </div>
      </div>

      {/* Visual Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Drawing Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-brand-card border border-brand-border h-[420px] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 text-xs font-bold uppercase px-3 py-1 bg-indigo-950/40 text-indigo-400 rounded-full border border-indigo-900/40">
            Interactive Node Sandbox
          </div>

          <svg 
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair bg-brand-dark/10"
          >
            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from)!;
              const toNode = nodes.find(n => n.id === edge.to)!;
              if (!fromNode || !toNode) return null;
              
              const isHighlight = visitedList.includes(edge.from) && visitedList.includes(edge.to);

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isHighlight ? '#14B8A6' : '#23324C'}
                    strokeWidth={isHighlight ? 4 : 2}
                    className="transition-all duration-300"
                  />
                  <rect
                    x={(fromNode.x + toNode.x)/2 - 10}
                    y={(fromNode.y + toNode.y)/2 - 10}
                    width="20"
                    height="20"
                    rx="4"
                    fill="#0F1626"
                    stroke="#23324C"
                  />
                  <text
                    x={(fromNode.x + toNode.x)/2}
                    y={(fromNode.y + toNode.y)/2 + 4}
                    fill="#9CA3AF"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isVisited = visitedList.includes(node.id);

              let strokeColor = '#23324C';
              let fillColor = '#161F30';
              if (isSelected) { strokeColor = '#A855F7'; fillColor = '#1A112C'; }
              else if (isVisited) { strokeColor = '#14B8A6'; fillColor = 'rgba(20, 184, 166, 0.2)'; }

              return (
                <g key={node.id} className="cursor-pointer">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar Guide */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between h-[420px]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5" /> How to Play:
            </h3>
            <ul className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="p-1 bg-indigo-600/20 border border-indigo-500/40 rounded text-indigo-300 font-bold shrink-0">1</span>
                <span>Click anywhere on the empty canvas grid to **create** a new graph node.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="p-1 bg-indigo-600/20 border border-indigo-500/40 rounded text-indigo-300 font-bold shrink-0">2</span>
                <span>Select a node (highlights purple), then click on a different node to **draw a weighted edge** linking them.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="p-1 bg-indigo-600/20 border border-indigo-500/40 rounded text-indigo-300 font-bold shrink-0">3</span>
                <span>Choose a traversal method above and click **Run Traversal** to watch nodes highlight in order!</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-[#111A2C] border border-brand-border/40 rounded-xl text-[10px] text-gray-500 leading-normal">
            *Nodes are labeled alphabetically sequentially. Graph connections are auto-cached during draw actions.*
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphPlayground;


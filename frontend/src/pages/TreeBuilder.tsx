import React, { useState } from 'react';
import { Play, RotateCcw, Plus } from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const TreeBuilder: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [insertVal, setInsertVal] = useState('');
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  // Helper: Recursive insertion
  const insertIntoBST = (node: TreeNode | null, val: number): TreeNode => {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) {
      node.left = insertIntoBST(node.left, val);
    } else if (val > node.val) {
      node.right = insertIntoBST(node.right, val);
    }
    return node;
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseInt(insertVal);
    if (isNaN(v)) return;

    // Create a copy of tree and insert
    const newRoot = root ? { ...root } : null;
    const finalRoot = insertIntoBST(newRoot, v);
    setRoot({ ...finalRoot });
    setInsertVal('');
  };

  // Helper: Preorder traversal collector
  const collectInorder = (node: TreeNode | null, arr: number[]) => {
    if (!node) return;
    collectInorder(node.left, arr);
    arr.push(node.val);
    collectInorder(node.right, arr);
  };

  const runTraversal = () => {
    if (!root) return;
    setAnimating(true);
    const arr: number[] = [];
    collectInorder(root, arr);

    // Animate path step-by-step
    let i = 0;
    const interval = setInterval(() => {
      if (i >= arr.length) {
        setAnimating(false);
        setActiveNode(null);
        clearInterval(interval);
        return;
      }
      setActiveNode(arr[i]);
      setTraversalPath(prev => [...prev, arr[i]]);
      i++;
    }, 900);
  };

  const clearTree = () => {
    setRoot(null);
    setTraversalPath([]);
    setActiveNode(null);
    setAnimating(false);
  };

  // Helper: Render SVG tree elements recursively
  const renderTree = (node: TreeNode | null, x: number, y: number, offset: number): React.ReactNode => {
    if (!node) return null;
    const elements: React.ReactNode[] = [];

    const isActive = activeNode === node.val;
    const isVisited = traversalPath.includes(node.val);

    let circleColor = '#161F30';
    let strokeColor = '#23324C';
    if (isActive) { strokeColor = '#EF4444'; circleColor = 'rgba(239, 68, 68, 0.2)'; }
    else if (isVisited) { strokeColor = '#14B8A6'; circleColor = 'rgba(20, 184, 166, 0.2)'; }

    // Draw left child link
    if (node.left) {
      elements.push(
        <line
          key={`line-l-${node.val}`}
          x1={x} y1={y}
          x2={x - offset} y2={y + 60}
          stroke="#23324C"
          strokeWidth="2"
        />
      );
      elements.push(renderTree(node.left, x - offset, y + 60, offset * 0.5));
    }

    // Draw right child link
    if (node.right) {
      elements.push(
        <line
          key={`line-r-${node.val}`}
          x1={x} y1={y}
          x2={x + offset} y2={y + 60}
          stroke="#23324C"
          strokeWidth="2"
        />
      );
      elements.push(renderTree(node.right, x + offset, y + 60, offset * 0.5));
    }

    // Draw self node
    elements.push(
      <g key={`node-${node.val}`}>
        <circle
          cx={x} cy={y} r="18"
          fill={circleColor}
          stroke={strokeColor}
          strokeWidth="3"
          className="transition-all duration-300"
        />
        <text
          x={x} y={y + 4}
          fill="white"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {node.val}
        </text>
      </g>
    );

    return <g key={`g-${node.val}`}>{elements}</g>;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Binary Search Tree Builder</h1>
        <p className="mt-2 text-sm text-gray-400">Interactively construct and traverse binary search trees. Insert values below and run sorting traversals.</p>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
        <form onSubmit={handleInsert} className="flex gap-2">
          <input
            type="number"
            required
            placeholder="Node Value (E.g. 25)"
            className="px-4 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs w-44 focus:outline-none focus:border-indigo-500 text-white"
            value={insertVal}
            onChange={(e) => setInsertVal(e.target.value)}
          />
          <button
            type="submit"
            disabled={animating}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-500 text-white shadow-glow disabled:opacity-40 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Insert
          </button>
        </form>

        <div className="flex gap-2">
          <button
            onClick={runTraversal}
            disabled={animating || !root}
            className="px-4 py-2 bg-brand-teal text-white text-xs font-semibold rounded-lg hover:bg-teal-500 disabled:opacity-35 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" /> Animate Inorder
          </button>
          <button
            onClick={clearTree}
            className="px-4 py-2 bg-[#111A2C] border border-brand-border text-xs font-semibold rounded-lg hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset Tree
          </button>
        </div>
      </div>

      {/* SVG Canvas and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Drawing Workspace */}
        <div className="lg:col-span-2 rounded-2xl bg-brand-card border border-brand-border h-[420px] relative overflow-hidden flex flex-col justify-between p-6">
          <div className="absolute top-4 right-4 text-xs font-bold uppercase px-3 py-1 bg-indigo-950/40 text-indigo-400 rounded-full border border-indigo-900/40">
            Tree Viewport
          </div>

          <div className="flex-1 flex items-center justify-center">
            {root ? (
              <svg className="w-full h-80 overflow-visible">
                {renderTree(root, 220, 40, 80)}
              </svg>
            ) : (
              <div className="text-xs text-gray-500">Tree is empty. Insert a node value above to begin.</div>
            )}
          </div>
        </div>

        {/* Traversal readout */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">In-order Traversal Path</h3>
            <div className="flex flex-wrap gap-2">
              {traversalPath.length === 0 ? (
                <span className="text-xs text-gray-500">Path log empty.</span>
              ) : (
                traversalPath.map((v, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-lg bg-[#111A2C] border border-brand-border text-xs font-mono font-bold text-brand-teal animate-pulse">
                    {v}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/40 text-[10px] text-gray-500 leading-normal">
            **Inorder Traversal** yields nodes in sorted ascending order because it visits the left subtree, followed by the parent node, followed by the right subtree.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeBuilder;

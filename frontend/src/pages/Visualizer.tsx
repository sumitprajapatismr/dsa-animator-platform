import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from "../utils/api";
import {
  generateBubbleSortSteps,
  generateQuickSortSteps,
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateSinglyListSteps,
  generateDijkstraSteps,
  SortingStep,
  ListStep,
  GraphStep
} from '../utils/visualizerEngine';
import { playSoundTone } from '../utils/audio';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code2, Cpu } from 'lucide-react';

const LANGUAGE_CODES: Record<string, string[]> = {
  javascript: [
    "function solve(arr) {",
    "  let n = arr.length;",
    "  for (let i = 0; i < n; i++) {",
    "    if (arr[i] === target) return i;",
    "  }",
    "  return -1;",
    "}"
  ],
  python: [
    "def solve(arr, target):",
    "    n = len(arr)",
    "    for i in range(n):",
    "        if arr[i] == target:",
    "            return i",
    "    return -1"
  ],
  cpp: [
    "int solve(int arr[], int n, int target) {",
    "    for(int i = 0; i < n; i++) {",
    "        if(arr[i] == target) return i;",
    "    }",
    "    return -1;",
    "}"
  ],
  java: [
    "public int solve(int[] arr, int target) {",
    "    int n = arr.length;",
    "    for(int i = 0; i < n; i++) {",
    "        if(arr[i] == target) return i;",
    "    }",
    "    return -1;",
    "}"
  ]
};

const Visualizer: React.FC = () => {
  const [category, setCategory] = useState<'sorting' | 'searching' | 'linkedlist' | 'stack' | 'queue' | 'tree' | 'graph'>('sorting');
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [lang, setLang] = useState<string>('javascript');

  // Input states
  const [customInput, setCustomInput] = useState<string>('12, 45, 8, 22, 19, 5');
  const [arraySize, setArraySize] = useState<number>(6);
  const [speed, setSpeed] = useState<number>(800); // ms delay

  // Visualizer execution states
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Statistics
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);

  // Quiz States
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const playTimer = useRef<any>(null);

  useEffect(() => {
    resetVisualizer();
  }, [category, algorithm, customInput, arraySize]);

  const parseCustomInput = (): number[] => {
    try {
      return customInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)).slice(0, arraySize);
    } catch {
      return [12, 45, 8, 22, 19, 5];
    }
  };

  const generateRandomArray = () => {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 80) + 10);
    setCustomInput(arr.join(', '));
    playSoundTone('click');
  };

  const resetVisualizer = () => {
    setIsPlaying(false);
    if (playTimer.current) clearInterval(playTimer.current);
    setCurrentStepIdx(0);
    setComparisons(0);
    setSwaps(0);
    setQuizScore(null);
    setQuizAnswers({});

    const inputArr = parseCustomInput();
    let generatedSteps: any[] = [];

    if (category === 'sorting') {
      if (algorithm === 'bubble') {
        generatedSteps = generateBubbleSortSteps(inputArr);
      } else {
        generatedSteps = generateQuickSortSteps(inputArr);
      }
    } else if (category === 'searching') {
      if (algorithm === 'linear') {
        generatedSteps = generateLinearSearchSteps(inputArr, 22);
      } else {
        generatedSteps = generateBinarySearchSteps(inputArr, 22);
      }
    } else if (category === 'linkedlist') {
      const initialNodes = inputArr.map((v, i) => ({ id: `node_${i}`, val: v }));
      generatedSteps = generateSinglyListSteps(initialNodes, 'search', 22);
    } else if (category === 'stack') {
      // Simulate stack operations
      const sSteps = [];
      let stackState = [...inputArr];
      sSteps.push({
        array: [...stackState],
        highlights: [],
        pointers: {},
        explanation: 'Initialize stack from input values.',
        codeLine: 0
      });
      // Pop operation
      stackState.pop();
      sSteps.push({
        array: [...stackState],
        highlights: [],
        pointers: {},
        explanation: 'Pop operation: removed top element.',
        codeLine: 2
      });
      // Push operation
      stackState.push(99);
      sSteps.push({
        array: [...stackState],
        highlights: [stackState.length - 1],
        pointers: {},
        explanation: 'Push operation: pushed value 99 onto stack.',
        codeLine: 3
      });
      generatedSteps = sSteps;
    } else if (category === 'queue') {
      // Simulate queue operations
      const qSteps = [];
      let queueState = [...inputArr];
      qSteps.push({
        array: [...queueState],
        highlights: [],
        pointers: {},
        explanation: 'Initialize queue from input values.',
        codeLine: 0
      });
      // Dequeue
      queueState.shift();
      qSteps.push({
        array: [...queueState],
        highlights: [],
        pointers: {},
        explanation: 'Dequeue operation: removed front element.',
        codeLine: 2
      });
      // Enqueue
      queueState.push(99);
      qSteps.push({
        array: [...queueState],
        highlights: [queueState.length - 1],
        pointers: {},
        explanation: 'Enqueue operation: added value 99 to back.',
        codeLine: 3
      });
      generatedSteps = qSteps;
    } else if (category === 'tree') {
      // Tree visualizer simulation
      const tSteps = [];
      tSteps.push({
        array: [...inputArr],
        highlights: [0],
        pointers: {},
        explanation: 'Initialize BST with root node.',
        codeLine: 0
      });
      generatedSteps = tSteps;
    } else if (category === 'graph') {
      const initialGraphNodes = [
        { id: 'A', label: 'A', x: 80, y: 150 },
        { id: 'B', label: 'B', x: 220, y: 70 },
        { id: 'C', label: 'C', x: 220, y: 230 }
      ];
      const initialGraphEdges = [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 }
      ];
      generatedSteps = generateDijkstraSteps(initialGraphNodes, initialGraphEdges, 'A');
    }

    setSteps(generatedSteps);
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      playTimer.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (playTimer.current) clearInterval(playTimer.current);
            return prev;
          }
          // Increment stats on changes
          const next = prev + 1;
          const step = steps[next];
          if (step?.explanation?.toLowerCase().includes('compare')) {
            setComparisons(c => c + 1);
          }
          if (step?.explanation?.toLowerCase().includes('swap')) {
            setSwaps(s => s + 1);
          }
          return next;
        });
      }, speed);
    } else {
      if (playTimer.current) clearInterval(playTimer.current);
    }

    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, [isPlaying, steps, speed]);

  // Log usage
  useEffect(() => {
    const logInteraction = async () => {
      try {
        const token = localStorage.getItem('token');
        await api.post('/api/progress/algo', {
          topicId: category,
          algoId: algorithm
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // Silent error
      }
    };
    logInteraction();
  }, [category, algorithm]);

  const currentStep = steps[currentStepIdx] || null;

  // Mock quiz questions
  const quizQuestions = [
    { q: 'What is the average time complexity of this algorithm?', opts: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'], ansIdx: 1 },
    { q: 'Is this algorithm stable or unstable?', opts: ['Stable', 'Unstable'], ansIdx: 0 }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.ansIdx) score++;
    });
    setQuizScore(Math.round((score / quizQuestions.length) * 100));
    playSoundTone('success');
  };

  return (
    <div className="space-y-6">
      {/* Category selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
        <div className="flex flex-wrap gap-2">
          {(['sorting', 'searching', 'linkedlist', 'stack', 'queue', 'tree', 'graph'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setAlgorithm(cat === 'sorting' ? 'bubble' : cat === 'searching' ? 'linear' : cat === 'linkedlist' ? 'singly' : cat === 'stack' ? 'stack' : cat === 'queue' ? 'queue' : cat === 'tree' ? 'bst' : 'dijkstra');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${category === cat ? 'bg-indigo-650 text-white' : 'bg-[#111A2C] text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 font-semibold">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#111A2C] border border-brand-border text-white focus:outline-none"
          >
            {category === 'sorting' && (
              <>
                <option value="bubble">Bubble Sort</option>
                <option value="quick">Quick Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="heap">Heap Sort</option>
              </>
            )}
            {category === 'searching' && (
              <>
                <option value="linear">Linear Search</option>
                <option value="binary">Binary Search</option>
                <option value="jump">Jump Search</option>
              </>
            )}
            {category === 'linkedlist' && <option value="singly">Singly Linked List</option>}
            {category === 'stack' && <option value="stack">Stack Simulator</option>}
            {category === 'queue' && <option value="queue">Queue Simulator</option>}
            {category === 'tree' && <option value="bst">Binary Search Tree</option>}
            {category === 'graph' && <option value="dijkstra">Dijkstra Shortest Path</option>}
          </select>
        </div>
      </div>

      {/* Main visualizer grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas panel */}
        <div className="lg:col-span-2 flex flex-col p-6 rounded-2xl bg-brand-card border border-brand-border h-[480px] justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[10px] font-bold uppercase px-3 py-1 bg-indigo-950/40 text-indigo-400 rounded-full border border-indigo-900/40">
            Interactive Canvas
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            {currentStep && (category === 'sorting' || category === 'searching' || category === 'stack' || category === 'queue' || category === 'tree') && (currentStep as SortingStep)?.array && (
              <div className="flex items-end gap-3 h-60 w-full max-w-md justify-center">
                {(currentStep as SortingStep)?.array?.map((val, idx) => {
                  const isHighlighted = (currentStep as SortingStep)?.highlights?.includes(idx);
                  const isPivot = (currentStep as SortingStep)?.pointers?.pivot === idx;
                  
                  let barColor = 'bg-indigo-650/40 border border-indigo-500/20';
                  if (isHighlighted) barColor = 'bg-cyan-500 shadow-glow-teal';
                  if (isPivot) barColor = 'bg-purple-500 shadow-glow-purple';

                  return (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <span className="text-[10px] font-mono mb-2">{val}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                        style={{ height: `${Math.min(180, val * 2.5)}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep && category === 'linkedlist' && (currentStep as ListStep)?.nodes && (
              <div className="flex items-center gap-4 overflow-x-auto py-6 justify-center w-full">
                {(currentStep as ListStep)?.nodes?.map((node, idx) => {
                  const isHighlighted = (currentStep as ListStep)?.highlights?.includes(node.id);
                  const isCurrent = (currentStep as ListStep)?.pointers?.curr === node.id;

                  let cardStyle = 'border-brand-border bg-[#111A2C]';
                  if (isHighlighted) cardStyle = 'border-cyan-500 bg-cyan-950/20 text-cyan-400 shadow-glow-teal';
                  if (isCurrent) cardStyle = 'border-indigo-500 bg-indigo-950/20 text-indigo-400 shadow-glow';

                  return (
                    <div key={node.id} className="flex items-center">
                      <div className={`flex flex-col items-center justify-center w-16 h-16 border rounded-xl transition-all duration-300 ${cardStyle}`}>
                        <span className="text-[9px] text-gray-500">Value</span>
                        <span className="text-sm font-bold">{node.val}</span>
                      </div>
                      {node.next && (
                        <div className="text-indigo-400 font-bold text-lg px-1">➔</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep && category === 'graph' && (currentStep as GraphStep)?.nodes && (
              <svg className="w-full h-72 max-w-md overflow-visible">
                {(currentStep as GraphStep)?.edges?.map((edge, idx) => {
                  const fromNode = (currentStep as GraphStep)?.nodes?.find(n => n.id === edge.from);
                  const toNode = (currentStep as GraphStep)?.nodes?.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={edge.highlighted ? '#14B8A6' : '#23324C'}
                        strokeWidth={edge.highlighted ? 3 : 1.5}
                      />
                    </g>
                  );
                })}
                {(currentStep as GraphStep)?.nodes?.map((node) => {
                  const isHighlighted = (currentStep as GraphStep)?.highlights?.includes(node.id);
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        fill="#161F30"
                        stroke={isHighlighted ? '#14B8A6' : '#23324C'}
                        strokeWidth="2"
                      />
                      <text x={node.x} y={node.y + 3} fill="white" fontSize="10" textAnchor="middle">{node.label}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Timeline and Speed Controls */}
          <div className="flex flex-col gap-4 border-t border-brand-border/40 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-gray-500 font-mono">Step {currentStepIdx + 1}/{steps.length || 1}</span>
              <input
                type="range"
                min="0"
                max={Math.max(0, steps.length - 1)}
                value={currentStepIdx}
                onChange={(e) => setCurrentStepIdx(Number(e.target.value))}
                className="flex-1 accent-indigo-600 h-1 bg-gray-800 rounded appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 text-xs">
              <div className="flex gap-2">
                <button onClick={() => { setCurrentStepIdx(prev => Math.max(0, prev - 1)); playSoundTone('click'); }} disabled={currentStepIdx === 0} className="p-2 bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white rounded disabled:opacity-30">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={() => { setIsPlaying(!isPlaying); playSoundTone('click'); }} className="px-4 py-2 bg-indigo-650 text-white rounded font-bold hover:bg-indigo-600">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => { setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1)); playSoundTone('click'); }} disabled={currentStepIdx === steps.length - 1} className="p-2 bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white rounded disabled:opacity-30">
                  <SkipForward className="w-4 h-4" />
                </button>
                <button onClick={() => { resetVisualizer(); playSoundTone('click'); }} className="p-2 bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white rounded">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-500">Speed (ms):</span>
                <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-indigo-600 w-24 h-1 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Code trace panel */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[480px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Code2 className="w-5 h-5" /> Code Trace
            </h3>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-2.5 py-1 text-[10px] rounded bg-brand-dark border border-brand-border text-gray-400 focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex-1 rounded-xl bg-[#070913] border border-brand-border/40 p-4 font-mono text-[10px] text-gray-400 overflow-y-auto space-y-1">
            {LANGUAGE_CODES[lang].map((line, idx) => {
              const isActive = currentStep?.codeLine === idx;
              return (
                <div key={idx} className={`px-2 py-0.5 rounded ${isActive ? 'bg-indigo-650/30 text-white font-bold border-l-2 border-indigo-500' : ''}`}>
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input controller row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Custom Input Array</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs text-white"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button onClick={generateRandomArray} className="px-4 py-2 bg-[#111A2C] border border-brand-border text-xs font-bold text-gray-300 hover:text-white rounded-lg">
              Random Array
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Array Size:</span>
            <input type="range" min="3" max="12" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} className="accent-indigo-600 w-44 h-1 bg-gray-800 rounded" />
          </div>
        </div>

        {/* Complexity specs panel */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Complexity Specification</h3>
          <div className="text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-brand-border/30 pb-1.5">
              <span className="text-gray-500">Best Case Time:</span>
              <span className="text-white">O(N)</span>
            </div>
            <div className="flex justify-between border-b border-brand-border/30 pb-1.5">
              <span className="text-gray-500">Average Case Time:</span>
              <span className="text-white">O(N log N)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Worst Case Time:</span>
              <span className="text-white">O(N^2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dry Run Execution Log Table */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Dry Run Execution Table</h3>
        <div className="overflow-x-auto max-h-44 pr-1">
          <table className="w-full text-xs text-left border-collapse text-gray-400">
            <thead>
              <tr className="border-b border-brand-border/40 text-[10px] uppercase font-bold text-gray-500">
                <th className="py-2 px-3">Step Index</th>
                <th className="py-2 px-3">Action Description</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, idx) => (
                <tr key={idx} className={`border-b border-brand-border/20 ${currentStepIdx === idx ? 'bg-indigo-950/20 text-white font-semibold' : ''}`}>
                  <td className="py-2 px-3">Step {idx + 1}</td>
                  <td className="py-2 px-3 font-mono">{step.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI step guidance and Quiz card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI tutor panel */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Cpu className="w-5 h-5 animate-pulse" /> AI Step Explanation
          </h3>
          <div className="text-xs text-gray-300 leading-relaxed bg-brand-dark/40 border border-brand-border/40 p-4 rounded-xl space-y-2">
            <p className="font-semibold text-white">{currentStep?.explanation || 'No step active.'}</p>
            <div className="border-t border-brand-border/30 pt-2 text-[10px] text-gray-400">
              <span className="font-bold text-indigo-400 block mb-1">Interview Tip:</span>
              Always check base cases and boundary offsets when partitioning arrays recursively in quicksort templates.
            </div>
          </div>
        </div>

        {/* Post-run Quiz */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Checkpoint MCQ Questionnaire</h3>
          <div className="space-y-4 text-xs">
            {quizQuestions.map((q, i) => (
              <div key={i} className="space-y-2">
                <p className="text-gray-300 font-semibold">{q.q}</p>
                <div className="flex gap-2">
                  {q.opts.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      disabled={quizScore !== null}
                      onClick={() => { setQuizAnswers({ ...quizAnswers, [i]: oIdx }); playSoundTone('click'); }}
                      className={`flex-1 py-2 text-[10px] font-bold border rounded-lg transition-all ${quizAnswers[i] === oIdx ? 'bg-indigo-650 text-white' : 'bg-brand-dark border-brand-border/60 text-gray-400'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {quizScore === null ? (
              <button
                onClick={handleQuizSubmit}
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded shadow-glow"
              >
                Submit MCQ Answers
              </button>
            ) : (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 rounded-lg text-[10px] font-bold text-center">
                Quiz Score: {quizScore}% | Core concepts successfully validated.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;


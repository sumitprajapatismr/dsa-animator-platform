import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { playSoundTone } from '../utils/audio';
import { Lock, BookOpen, CheckCircle, Zap, Shield, Sparkles, Compass } from 'lucide-react';

interface TopicNode {
  id: string;
  name: string;
  desc: string;
  percentage: number;
  prereqs: string[];
  project: string;
}

const Roadmap: React.FC = () => {
  const [topics, setTopics] = useState<TopicNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [careerPath, setCareerPath] = useState('FAANG Preparation');

  // Simulated AI diagnostics
  const [googleReady, setGoogleReady] = useState(68);
  const [amazonReady, setAmazonReady] = useState(74);
  const [microsoftReady, setMicrosoftReady] = useState(61);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map topicStats
        const mapped = res.data.topicStats.map((t: any) => {
          let desc = 'Learn fundamental algorithms & vector structures.';
          let prereqs: string[] = [];
          let project = 'Expense Tracker';

          if (t.id === 'sorting') {
            desc = 'Master Bubble, Merge, and Quick sorting mechanics.';
            prereqs = ['Arrays'];
            project = 'Sorting Canvas Viz';
          }
          if (t.id === 'searching') {
            desc = 'Linear and binary searches bounds tracking.';
            prereqs = ['Arrays'];
            project = 'File Search Engine';
          }
          if (t.id === 'linkedlist') {
            desc = 'Singly, doubly, and circular chain manipulations.';
            prereqs = ['Sorting'];
            project = 'Circular Buffer System';
          }
          if (t.id === 'stackqueue') {
            desc = 'FILO and LIFO sequence buffers.';
            prereqs = ['LinkedList'];
            project = 'Text Undo History';
          }
          if (t.id === 'graphs') {
            desc = 'Path relaxation, Dijkstra shortest paths, BFS/DFS traversal.';
            prereqs = ['Trees', 'Recursion'];
            project = 'Google Maps Simulation';
          }
          if (t.id === 'trees') {
            desc = 'Balanced search trees (BST/AVL) traversals and balancing rotations.';
            prereqs = ['LinkedList', 'StackQueue'];
            project = 'System File Explorer';
          }
          if (t.id === 'dp') {
            desc = 'Memoization, tabulation, and optimal substructure grids.';
            prereqs = ['Trees', 'Recursion'];
            project = 'Stock Profit Predictor';
          }
          if (t.id === 'backtracking') {
            desc = 'Depth-first search state backtracking logic (N-Queens).';
            prereqs = ['Recursion'];
            project = 'Maze Escape Solver';
          }

          return {
            id: t.id,
            name: t.name,
            desc,
            percentage: t.percentage || 0,
            prereqs,
            project
          };
        });

        setTopics(mapped);
      } catch (err) {
        // Fallback mock topics if backend dashboard fails
        setTopics([
          { id: 'arrays', name: 'Arrays & Strings', desc: 'Vectors, sliding windows, prefix sums.', percentage: 100, prereqs: [], project: 'Expense Tracker' },
          { id: 'sorting', name: 'Sorting Algorithms', desc: 'Bubble Sort, Merge Sort, Quicksort.', percentage: 60, prereqs: ['Arrays'], project: 'Sorting Viz Canvas' },
          { id: 'searching', name: 'Searching Algorithms', desc: 'Linear search, binary searches.', percentage: 40, prereqs: ['Arrays'], project: 'File Finder' },
          { id: 'trees', name: 'Binary Trees & BSTs', desc: 'Traversals, BST inserts/deletes.', percentage: 0, prereqs: ['Sorting'], project: 'Directory Explorer' },
          { id: 'graphs', name: 'Graph Systems', desc: 'Dijkstra shortest paths, BFS/DFS cycles.', percentage: 0, prereqs: ['Trees'], project: 'Google Maps Simulation' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [careerPath]);

  const handlePathChange = (path: string) => {
    setCareerPath(path);
    playSoundTone('click');
    // Randomize readiness for visual variance
    setGoogleReady(Math.floor(Math.random() * 30) + 50);
    setAmazonReady(Math.floor(Math.random() * 30) + 50);
    setMicrosoftReady(Math.floor(Math.random() * 30) + 50);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Computing your personalized learning roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-sans">AI Learning Roadmap</h1>
          <p className="text-xs text-gray-400 mt-1">Personalized curriculum pathways mapping target FAANG readiness levels dynamically.</p>
        </div>

        {/* Career Path selectors */}
        <select
          value={careerPath}
          onChange={(e) => handlePathChange(e.target.value)}
          className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded text-xs text-white"
        >
          <option>FAANG Preparation</option>
          <option>Competitive Programming</option>
          <option>Interview Crash Course</option>
          <option>Full Stack Developer</option>
        </select>
      </div>

      {/* AI Readiness Indicators and Optimizer advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness progress gauges */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Company Readiness Forecast
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/40 space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Google</span>
              <span className="text-lg font-black text-indigo-400">{googleReady}%</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/40 space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Amazon</span>
              <span className="text-lg font-black text-indigo-400">{amazonReady}%</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/40 space-y-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Microsoft</span>
              <span className="text-lg font-black text-indigo-400">{microsoftReady}%</span>
            </div>
          </div>
        </div>

        {/* AI advisor tip */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> AI Path Optimizer
          </h3>
          <p className="text-[11px] text-gray-300 leading-relaxed bg-[#070913]/30 border border-brand-border/30 p-3 rounded-lg">
            Quicksort partitioning efficiency is low. Spend 20m reviewing Recursion Tree paths before tackling Graph DFS relaxations.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-brand-border ml-6 pl-8 space-y-8 py-4">
        {topics.map((node, index) => {
          const isCompleted = node.percentage === 100;
          // Locked if previous topic has < 40% completion
          const isLocked = index > 0 && topics[index - 1].percentage < 40;

          let indicatorIcon = <BookOpen className="w-4 h-4 text-indigo-400" />;
          let indicatorBg = 'bg-[#111A2C] border-brand-border';
          
          if (isLocked) {
            indicatorIcon = <Lock className="w-4 h-4 text-gray-500" />;
            indicatorBg = 'bg-brand-dark border-gray-800';
          } else if (isCompleted) {
            indicatorIcon = <CheckCircle className="w-4 h-4 text-emerald-400" fill="rgba(16, 185, 129, 0.15)"/>;
            indicatorBg = 'bg-emerald-950/20 border-emerald-900/60';
          }

          return (
            <div key={node.id} className="relative group">
              {/* Left Timeline Dot */}
              <div className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${indicatorBg}`}>
                {indicatorIcon}
              </div>

              {/* Card Container */}
              <div className={`p-6 rounded-2xl bg-brand-card border border-brand-border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${isLocked ? 'opacity-40 select-none' : 'hover:border-indigo-500/50 hover:shadow-glow'}`}>
                <div className="space-y-2 max-w-lg">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {node.name}
                    {!isLocked && node.percentage > 0 && (
                      <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded font-black">
                        {node.percentage}% Done
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{node.desc}</p>
                  
                  {/* Prereq locks block */}
                  {node.prereqs.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                      <Shield className="w-3.5 h-3.5" /> Prereqs: {node.prereqs.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  {isLocked ? (
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Locked</span>
                  ) : isCompleted ? (
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">In Progress</span>
                  )}

                  {/* Project unlocks indicators */}
                  {!isLocked && (
                    <div className="text-[10px] text-gray-500 bg-brand-dark border border-brand-border/40 px-2 py-1 rounded">
                      Project: <span className="font-bold text-indigo-400">{node.project}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;

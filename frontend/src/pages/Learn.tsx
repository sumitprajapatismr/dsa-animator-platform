import React, { useState } from 'react';
import { BookOpen, Sparkles, HelpCircle, Table } from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

const Learn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'flashcards' | 'cheatsheet'>('theory');

  // Flashcards state
  const flashcards: Flashcard[] = [
    { id: 1, question: "What is the worst-case complexity of Quick Sort?", answer: "O(N^2) which occurs when the pivot chosen is always the smallest or largest element." },
    { id: 2, question: "What is the key principle behind a Queue?", answer: "FIFO (First In First Out) - elements are inserted at the back and removed from the front." },
    { id: 3, question: "Which traversal of a BST yields elements in sorted order?", answer: "In-order traversal (Left, Root, Right)." },
    { id: 4, question: "What is the average time complexity of Hash Map operations?", answer: "O(1) average time complexity for insert, delete, and lookup." },
    { id: 5, question: "How does Dijkstra's algorithm differ from Prim's?", answer: "Dijkstra's finds the shortest paths from a single source to all nodes, while Prim's finds a Minimum Spanning Tree." }
  ];
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Cheat Sheet Data
  const complexData = [
    { ds: 'Array', insert: 'O(N)', delete: 'O(N)', search: 'O(N)', space: 'O(N)' },
    { ds: 'Singly Linked List', insert: 'O(1)', delete: 'O(1)', search: 'O(N)', space: 'O(N)' },
    { ds: 'Hash Table', insert: 'O(1) avg', delete: 'O(1) avg', search: 'O(1) avg', space: 'O(N)' },
    { ds: 'Binary Search Tree', insert: 'O(log N)', delete: 'O(log N)', search: 'O(log N)', space: 'O(N)' },
    { ds: 'AVL Tree', insert: 'O(log N)', delete: 'O(log N)', search: 'O(log N)', space: 'O(N)' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Learning Hub</h1>
        <p className="mt-2 text-sm text-gray-400">Deepen your knowledge of fundamental algorithms, test yourself with flashcards, or check time complexities.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-3">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${activeTab === 'theory' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" />
          Theory Modules
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${activeTab === 'flashcards' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <HelpCircle className="w-4 h-4" />
          Interactive Flashcards
        </button>
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${activeTab === 'cheatsheet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Table className="w-4 h-4" />
          Complexity Cheat Sheet
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'theory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border hover:shadow-glow transition-all">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Module 1</span>
              <h3 className="text-xl font-bold mt-2">Sorting Mechanics</h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">Learn the differences between comparison-based sorts like Bubble Sort vs divide-and-conquer sorts like Merge and Quick Sort.</p>
              <div className="w-full bg-gray-800 rounded-full h-1 mt-4 overflow-hidden">
                <div className="bg-indigo-500 h-1 rounded-full w-2/3" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border hover:shadow-glow transition-all">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Module 2</span>
              <h3 className="text-xl font-bold mt-2">Graph Traversals</h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">Understand breadth-first search (BFS) queue mechanics, depth-first search (DFS) recursion, and shortest paths in weighted graphs using Dijkstra's algorithm.</p>
              <div className="w-full bg-gray-800 rounded-full h-1 mt-4 overflow-hidden">
                <div className="bg-cyan-500 h-1 rounded-full w-1/3" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="flex flex-col items-center justify-center p-8 max-w-xl mx-auto">
            {/* Flashcard container */}
            <div 
              onClick={() => setFlipped(!flipped)}
              className="w-full h-64 border border-brand-border rounded-2xl glass-panel shadow-glow cursor-pointer relative transition-transform duration-500 transform preserve-3d"
            >
              <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all ${flipped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <span className="text-xs uppercase text-indigo-400 font-bold tracking-widest mb-4">Question</span>
                <p className="text-lg font-bold">{flashcards[currentCardIdx].question}</p>
                <span className="text-[10px] text-gray-500 mt-8">(Click to Reveal Answer)</span>
              </div>

              <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all ${!flipped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <span className="text-xs uppercase text-brand-teal font-bold tracking-widest mb-4">Answer</span>
                <p className="text-sm font-semibold text-gray-300 leading-relaxed">{flashcards[currentCardIdx].answer}</p>
                <span className="text-[10px] text-gray-500 mt-8">(Click to show Question)</span>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between w-full mt-6">
              <button
                onClick={() => {
                  setFlipped(false);
                  setCurrentCardIdx(prev => Math.max(0, prev - 1));
                }}
                disabled={currentCardIdx === 0}
                className="px-4 py-2 text-xs font-semibold rounded bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white disabled:opacity-30"
              >
                Previous Card
              </button>
              <span className="text-xs text-gray-500">Card {currentCardIdx + 1} of {flashcards.length}</span>
              <button
                onClick={() => {
                  setFlipped(false);
                  setCurrentCardIdx(prev => Math.min(flashcards.length - 1, prev + 1));
                }}
                disabled={currentCardIdx === flashcards.length - 1}
                className="px-4 py-2 text-xs font-semibold rounded bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white disabled:opacity-30"
              >
                Next Card
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow overflow-x-auto">
            <h3 className="text-lg font-bold mb-4">Data Structures Operations Complexity</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border/40 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="pb-3">Data Structure</th>
                  <th className="pb-3">Insertion</th>
                  <th className="pb-3">Deletion</th>
                  <th className="pb-3">Search</th>
                  <th className="pb-3">Worst Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30 text-gray-300">
                {complexData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-brand-dark/20">
                    <td className="py-3 font-semibold text-indigo-400">{row.ds}</td>
                    <td className="py-3 font-mono">{row.insert}</td>
                    <td className="py-3 font-mono">{row.delete}</td>
                    <td className="py-3 font-mono">{row.search}</td>
                    <td className="py-3 font-mono">{row.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;

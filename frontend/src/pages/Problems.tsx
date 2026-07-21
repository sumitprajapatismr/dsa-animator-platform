import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, BookOpen, AlertCircle } from 'lucide-react';
import api from "../utils/api";
interface ProblemSummary {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tag, setTag] = useState('');

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (tag) params.tag = tag;

      const res = await api.get('/api/problems', { params });
      setProblems(res.data.problems);
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input
    const delayDebounceFn = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, difficulty, tag]);

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Coding Challenges</h1>
        <p className="mt-2 text-sm text-gray-400">Practice your coding skills and earn XP on correct solutions.</p>
      </div>

      {/* Filter and search bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-[#111A2C] border border-brand-border rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-gray-200 placeholder:text-gray-600"
            placeholder="Search problems by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty */}
        <div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-[#111A2C] border border-brand-border rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-gray-400 focus:text-white"
          >
            <option value="">Any Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Tag filter */}
        <div>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-4 py-3 bg-[#111A2C] border border-brand-border rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-gray-400 focus:text-white"
          >
            <option value="">Any Topic</option>
            <option value="arrays">Arrays</option>
            <option value="sorting">Sorting</option>
            <option value="searching">Searching</option>
            <option value="stack">Stack</option>
            <option value="string">Strings</option>
          </select>
        </div>
      </div>

      {/* Problem list grid */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-16 w-full bg-brand-card/40 border border-brand-border/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-brand-border text-center">
          <AlertCircle className="w-12 h-12 text-gray-700 mb-3" />
          <h3 className="text-lg font-bold">No problems found</h3>
          <p className="text-sm text-gray-500 mt-1">Try modifying your query tags or keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((prob) => {
            let difficultyColor = 'text-green-400 bg-green-950/20 border-green-900/60';
            if (prob.difficulty === 'Medium') difficultyColor = 'text-yellow-400 bg-yellow-950/20 border-yellow-900/60';
            if (prob.difficulty === 'Hard') difficultyColor = 'text-red-400 bg-red-950/20 border-red-900/60';

            return (
              <div 
                key={prob._id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-indigo-500/50 hover:shadow-glow transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold hover:text-indigo-400 transition-colors">
                      <Link to={`/problems/${prob.slug}`}>{prob.title}</Link>
                    </h3>
                    <span className={`px-2.5 py-0.5 text-xs font-bold border rounded-full uppercase ${difficultyColor}`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span className="bg-brand-dark px-2 py-0.5 rounded border border-brand-border/50 text-[10px]">
                      Time: {prob.timeComplexity || 'O(N)'}
                    </span>
                    <span className="bg-brand-dark px-2 py-0.5 rounded border border-brand-border/50 text-[10px]">
                      Space: {prob.spaceComplexity || 'O(1)'}
                    </span>
                    <span className="text-gray-600">•</span>
                    {prob.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Link
                    to={`/problems/${prob.slug}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-glow transition-all"
                  >
                    Solve Challenge
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Problems;


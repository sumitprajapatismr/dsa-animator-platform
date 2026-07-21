import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Target, Search, Sliders } from 'lucide-react';
import api from "../utils/api";
interface Prob {
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
}

const CompanyPrep: React.FC = () => {
  const [problems, setProblems] = useState<Prob[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [loading, setLoading] = useState(true);

  const companies = ['Google', 'Meta', 'Microsoft', 'Amazon'];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      // Mock company problem mapping: Google maps to two-sum, Meta maps to valid-parentheses, Amazon maps to both
      const res = await api.get('/api/problems');
      const all = res.data.problems;
      
      let filtered = all;
      if (selectedCompany === 'Google') {
        filtered = all.filter((p: any) => p.slug === 'two-sum');
      } else if (selectedCompany === 'Meta') {
        filtered = all.filter((p: any) => p.slug === 'valid-parentheses');
      }
      setProblems(filtered);
    } catch (err) {
      console.error('Failed to fetch company problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedCompany]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Company Preparation Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">Target your preparation by practicing questions frequently asked in technical interviews at specific top tier tech companies.</p>
      </div>

      {/* Grid of Company selections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companies.map((comp) => {
          const isActive = selectedCompany === comp;
          return (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`p-6 rounded-2xl border text-center transition-all ${isActive ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold shadow-glow' : 'bg-brand-card border-brand-border text-gray-400 hover:text-white'}`}
            >
              <Target className="w-6 h-6 mx-auto mb-2 opacity-80" />
              <span className="text-sm block">{comp}</span>
            </button>
          );
        })}
      </div>

      {/* Target problems list */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          Frequently Asked Questions ({problems.length})
        </h3>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="h-14 w-full bg-brand-dark/40 border border-brand-border/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            No questions logged for this target company yet.
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((prob) => (
              <div key={prob._id} className="flex justify-between items-center p-4 rounded-xl bg-[#111A2C] border border-brand-border/40 hover:border-indigo-500/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-white hover:text-indigo-400">
                    <Link to={`/problems/${prob.slug}`}>{prob.title}</Link>
                  </h4>
                  <span className="text-[10px] text-gray-500 font-medium">Difficulty: {prob.difficulty}</span>
                </div>
                <Link
                  to={`/problems/${prob.slug}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg shadow-glow"
                >
                  Start Solving
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;


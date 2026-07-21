import React, { useState } from 'react';
import { FileText, Clipboard, Search, AlertCircle } from 'lucide-react';

interface AnalysisResults {
  score: number;
  atsCompatible: boolean;
  missingSkills: string[];
  grammarFormatCheck: string;
  suggestions: string[];
}

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'analyzer'>('builder');

  // Resume Builder States
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@domain.com');
  const [skills, setSkills] = useState('React, TypeScript, Redux, Node.js, Express, MongoDB, Data Structures');
  const [projects, setProjects] = useState('AlgoFlow AI: Premium AI DSA Visualization sandbox platform.');

  // Resume Analyzer States
  const [pasteResume, setPasteResume] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteResume.trim() || analyzing) return;

    setAnalyzing(true);
    setResults(null);

    // Simulated parser and keyword checklist
    setTimeout(() => {
      const lower = pasteResume.toLowerCase();
      const hasDsa = lower.includes('data structures') || lower.includes('algorithm');
      const hasGraph = lower.includes('graph') || lower.includes('tree');

      const missing: string[] = [];
      if (!hasDsa) missing.push('Data Structures & Algorithms');
      if (!hasGraph) missing.push('Binary Trees / Graph traversals');
      if (!lower.includes('docker') && !lower.includes('kubernetes')) missing.push('Cloud Deployments (Docker/K8s)');

      setResults({
        score: Math.min(100, (hasDsa ? 40 : 15) + (hasGraph ? 35 : 15) + 20),
        atsCompatible: hasDsa && hasGraph,
        missingSkills: missing,
        grammarFormatCheck: 'Formatting alignment is solid. Header tags match standard single-column ATS profiles.',
        suggestions: [
          'Incorporate clear quantitative bullet achievements (e.g. "Optimized DB lookups by 30%").',
          'Append core computer science coursework tags to clear automated ATS screening filters.'
        ]
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Lab</h1>
        <p className="mt-2 text-sm text-gray-400">Build ATS-optimized single-column resumes or analyze your current resume for keywords and skill gaps.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'builder' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Resume Builder
        </button>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'analyzer' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          ATS Analyzer
        </button>
      </div>

      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Builder Form */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Resume Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Project Details</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 h-20"
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Clean PDF Template Preview */}
          <div className="p-6 rounded-2xl bg-white text-gray-800 border border-gray-200 shadow-glow font-serif flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="border-b border-gray-800 pb-3 text-center">
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">{name}</h2>
                <span className="text-xs">{email} | Silicon Valley, CA</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">Education</h4>
                  <p className="text-[10px]">**B.S. in Computer Science** - Stanford University (2022 - 2026)</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">Technical Skills</h4>
                  <p className="text-[10px]">{skills}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">Projects</h4>
                  <p className="text-[10px] leading-relaxed">{projects}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-[10px] font-sans text-gray-500">
              <span>Standard Single-Column ATS Template</span>
              <button
                onClick={() => alert('Resume template copy success! Paste into Google Docs or export to PDF.')}
                className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded font-bold text-[9px] uppercase tracking-wider flex items-center gap-1"
              >
                <Clipboard className="w-3 h-3" /> Copy Text
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paste editor */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[360px]">
            <form onSubmit={handleAnalyze} className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-3">Paste Resume Text</h3>
                <textarea
                  required
                  placeholder="Paste the complete text contents of your current resume/CV here to analyze..."
                  className="w-full px-4 py-3 bg-[#111A2C] border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 h-44"
                  value={pasteResume}
                  onChange={(e) => setPasteResume(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={analyzing || !pasteResume.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow disabled:opacity-40"
              >
                {analyzing ? 'Evaluating ATS compliance...' : 'Analyze ATS Compatibility'}
              </button>
            </form>
          </div>

          {/* Analysis output */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[360px]">
            {!results ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Search className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-xs">Paste resume and click analyze to output checklist scorecards.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                  <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">ATS Score</span>
                  <span className={`text-lg font-black ${results.score >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {results.score} / 100
                  </span>
                </div>

                {results.missingSkills.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-gray-500 text-[10px] block uppercase font-bold">Missing Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {results.missingSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-red-950/20 border border-red-900/40 text-red-400 text-[9px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] block uppercase font-bold">Formatting Review:</span>
                  <p className="text-[11px] text-gray-400 leading-normal">{results.grammarFormatCheck}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] block uppercase font-bold">Suggestions:</span>
                  <ul className="list-disc pl-4 text-gray-400 text-[11px] space-y-1 leading-relaxed">
                    {results.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;


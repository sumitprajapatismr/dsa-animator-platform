import React, { useState, useEffect } from 'react';
import { playSoundTone } from '../utils/audio';
import { FileText, Calendar, Sparkles, Send, Trophy, Clock } from 'lucide-react';

interface CompanyData {
  process: string;
  eligibility: string;
  dsaTopics: string[];
  salaryRange: string;
}

const CareerHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'resume' | 'oa' | 'hr' | 'planner'>('companies');

  // Company prep states
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const companies: Record<string, CompanyData> = {
    Google: {
      process: '1 Online Assessment + 3 Coding rounds + 1 Googleyness behavioral round.',
      eligibility: 'B.Tech/M.Tech in CS/EE with CGPA > 7.5. No active backlogs.',
      dsaTopics: ['Trie traversals', 'Segment Trees', 'Dijkstra graph weights', 'Complex Recursion DP'],
      salaryRange: '$120k - $160k (L3/L4 base)'
    },
    Microsoft: {
      process: '1 Codility OA + 2 Technical DSA rounds + 1 System Design round.',
      eligibility: 'B.Tech/MCA with CGPA > 7.0.',
      dsaTopics: ['Binary Trees', 'Hash Tables', 'Sliding Window', 'Two Pointers'],
      salaryRange: '$110k - $145k (SDE 1)'
    },
    Amazon: {
      process: '1 HackerRank OA + 3 SDE coding loops + 1 Leadership principle round.',
      eligibility: 'B.Tech/M.Tech with CGPA > 7.0.',
      dsaTopics: ['Heaps', 'Priority Queues', 'Graph BFS/DFS', 'Dynamic Programming'],
      salaryRange: '$115k - $150k (L4 Base)'
    }
  };

  // Resume Analyzer
  const [resumeText, setResumeText] = useState('John Doe SDE Intern. Skills: JavaScript, React, Python.');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<string[]>([]);
  const [analyzingResume, setAnalyzingResume] = useState(false);

  // OA Simulator
  const [oaTimer, setOaTimer] = useState(2700); // 45m
  const [oaRunning, setOaRunning] = useState(false);
  const [oaAnswer, setOaAnswer] = useState('function solve(arr) {\n  // Code\n}');
  const [oaFeedback, setOaFeedback] = useState<string | null>(null);

  // HR Interview Simulation States
  const [hrQuestionIdx, setHrQuestionIdx] = useState(0);
  const [hrAnswer, setHrAnswer] = useState('');
  const [hrLog, setHrLog] = useState<Array<{ sender: 'recruiter' | 'user'; text: string }>>([
    { sender: 'recruiter', text: 'Welcome to the HR interview mock. Let us start: Tell me about yourself and your background.' }
  ]);
  const [hrScore, setHrScore] = useState<number | null>(null);

  const hrQuestions = [
    'Tell me about yourself and your background.',
    'What are your greatest professional strengths and weaknesses?',
    'Describe a conflict you resolved in a group project using the STAR method.'
  ];

  // Planner States
  const [semester, setSemester] = useState('6th');
  const [branch, setBranch] = useState('Computer Science');
  const [weakSubject, setWeakSubject] = useState('Operating Systems');
  const [plannerOutput, setPlannerOutput] = useState<string | null>(null);

  const handleAnalyzeResume = () => {
    setAnalyzingResume(true);
    playSoundTone('click');
    setTimeout(() => {
      setAtsScore(82);
      setAtsFeedback([
        'Missing keywords: "Docker", "Kubernetes", "Redis".',
        'Improve experience descriptions using the STAR format (Situation, Task, Action, Result).'
      ]);
      setAnalyzingResume(false);
      playSoundTone('success');
    }, 1200);
  };

  const handleStartOA = () => {
    setOaRunning(true);
    setOaTimer(2700);
    setOaFeedback(null);
    playSoundTone('click');
  };

  const handleSubmitOA = () => {
    setOaRunning(false);
    playSoundTone('success');
    setOaFeedback('OA Evaluation: 3/3 Test cases passed! Time limits: 0.12s. Optimal spatial bounds met.');
  };

  const handleHRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrAnswer.trim()) return;

    const answer = hrAnswer;
    setHrAnswer('');
    setHrLog(prev => [...prev, { sender: 'user', text: answer }]);
    playSoundTone('click');

    setTimeout(() => {
      if (hrQuestionIdx < hrQuestions.length - 1) {
        const nextIdx = hrQuestionIdx + 1;
        setHrQuestionIdx(nextIdx);
        setHrLog(prev => [...prev, { sender: 'recruiter', text: hrQuestions[nextIdx] }]);
      } else {
        setHrScore(88);
        setHrLog(prev => [...prev, { sender: 'recruiter', text: 'Mock finished! Thank you. I have compiled your score.' }]);
        playSoundTone('success');
      }
    }, 1000);
  };

  const generatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    playSoundTone('click');
    setPlannerOutput(`### CS Placement Study Plan (${semester} Sem - ${branch})
- **Daily schedule**: Dedicate 2 hours to **${weakSubject}** theory questions and 2 hours to DSA visualizer grids.
- **Weekly goal**: Solve 5 medium difficulty Array/String challenges and conduct 1 mock interview session.
- **Monthly goal**: Build 1 ATS-compatible resume and complete 1 company preparation track.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Placement Preparations Hub</h1>
          <p className="text-xs text-gray-400 mt-1">Study company-wise process insights, run mock OAs, analyze ATS resumes, and plan study calendars.</p>
        </div>

        {/* Dynamic readiness widgets */}
        <div className="flex gap-2 text-[10px] font-mono font-bold bg-[#111A2C] border border-brand-border p-2 rounded-xl">
          <span className="text-gray-400">Google: <span className="text-indigo-400">72%</span></span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">Amazon: <span className="text-indigo-400">81%</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border/40 text-xs">
        <button
          onClick={() => { setActiveTab('companies'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'companies' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Company Prep
        </button>
        <button
          onClick={() => { setActiveTab('resume'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'resume' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Resume Analyzer
        </button>
        <button
          onClick={() => { setActiveTab('oa'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'oa' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          OA Simulator
        </button>
        <button
          onClick={() => { setActiveTab('hr'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'hr' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          HR Mock Interview
        </button>
        <button
          onClick={() => { setActiveTab('planner'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'planner' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Study Planner
        </button>
      </div>

      {/* Workspace body */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow min-h-[380px] flex flex-col justify-between">
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(companies).map((comp) => {
                const isActive = selectedCompany === comp;
                return (
                  <button
                    key={comp}
                    onClick={() => { setSelectedCompany(comp); playSoundTone('click'); }}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${isActive ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400 shadow-glow' : 'bg-brand-dark border-brand-border/60 text-gray-400 hover:text-white'}`}
                  >
                    {comp} Overview
                  </button>
                );
              })}
            </div>

            <div className="p-6 rounded-xl bg-brand-dark/40 border border-brand-border/40 text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Salary insights Range</span>
                <span className="font-mono text-emerald-400 font-bold">{companies[selectedCompany].salaryRange}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Hiring Process</span>
                <p className="text-gray-300 mt-1 leading-relaxed">{companies[selectedCompany].process}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Eligibility Criteria</span>
                  <p className="text-gray-300 mt-1">{companies[selectedCompany].eligibility}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">High Frequency DSA</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {companies[selectedCompany].dsaTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900/60 text-indigo-400 text-[9px] font-mono">{topic}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* input */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Copy-Paste Resume Text</span>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-44 p-4 bg-brand-dark border border-brand-border rounded-xl text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAnalyzeResume}
                  disabled={analyzingResume}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white shadow-glow"
                >
                  {analyzingResume ? 'Analyzing ATS Profile...' : 'Analyze Resume Score'}
                </button>
              </div>

              {/* results */}
              <div className="p-4 rounded-xl bg-brand-dark/20 border border-brand-border/40 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5"><Trophy className="w-4 h-4 text-indigo-400" /> ATS Report</h4>
                {atsScore !== null ? (
                  <div className="space-y-3 font-sans">
                    <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                      <span className="text-gray-400">Match score:</span>
                      <span className="text-emerald-400 font-bold">{atsScore}%</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Optimizer tips:</span>
                      <ul className="list-disc pl-4 text-gray-400 space-y-1">
                        {atsFeedback.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Submit resume to generate diagnostics feedback scorecards.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oa' && (
          <div className="space-y-6">
            {!oaRunning ? (
              <div className="text-center py-12 space-y-4">
                <span className="text-xs text-gray-400 block">Start simulated placement assessment drives. Timer: 45m.</span>
                <button onClick={handleStartOA} className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white shadow-glow">
                  Begin Assessment Drive
                </button>
                {oaFeedback && (
                  <div className="max-w-md mx-auto p-4 rounded bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 text-xs font-mono">
                    {oaFeedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Target: Reverse a Singly Linked List in-place</span>
                  <div className="flex items-center gap-1.5 font-mono text-indigo-400">
                    <Clock className="w-4 h-4" /> 45:00
                  </div>
                </div>
                <textarea
                  value={oaAnswer}
                  onChange={(e) => setOaAnswer(e.target.value)}
                  className="w-full h-48 p-4 bg-[#070913] border border-brand-border rounded-xl text-xs font-mono text-emerald-400 resize-none focus:outline-none"
                />
                <button onClick={handleSubmitOA} className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white">
                  Submit Assessment
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hr' && (
          <div className="space-y-4 h-[320px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[240px]">
              {hrLog.map((log, idx) => {
                const isRecruiter = log.sender === 'recruiter';
                return (
                  <div key={idx} className={`flex ${isRecruiter ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${isRecruiter ? 'bg-brand-dark/80 border border-brand-border/40 text-gray-300' : 'bg-indigo-650 text-white shadow-glow'}`}>
                      <span className="block font-bold text-[8px] uppercase tracking-widest text-gray-500 mb-1">{isRecruiter ? 'Recruiter' : 'You'}</span>
                      {log.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {hrScore !== null && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 rounded-xl text-xs font-bold text-center">
                HR Interview Score: {hrScore}% | Strengths: Clear articulation of STAR conflict resolution paths.
              </div>
            )}

            {hrScore === null && (
              <form onSubmit={handleHRSubmit} className="flex gap-2 border-t border-brand-border/40 pt-3">
                <input
                  type="text"
                  required
                  placeholder="Answer recruiter question here..."
                  className="flex-1 px-4 py-2 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none"
                  value={hrAnswer}
                  onChange={(e) => setHrAnswer(e.target.value)}
                />
                <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={generatePlan} className="p-4 rounded-xl bg-brand-dark/20 border border-brand-border/40 space-y-3">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Current Semester</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs text-white focus:outline-none"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Target Recruiter</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs text-white focus:outline-none"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Weak Subject</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs text-white focus:outline-none"
                  value={weakSubject}
                  onChange={(e) => setWeakSubject(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded shadow-glow">
                Schedule Placement Calendar
              </button>
            </form>

            {/* Output */}
            <div className="p-4 rounded-xl bg-[#070913] border border-brand-border/40 text-xs font-mono text-gray-400">
              {plannerOutput ? (
                <div className="space-y-3 whitespace-pre-wrap leading-relaxed">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    AI Scheduler Plan
                  </div>
                  {plannerOutput}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <Calendar className="w-10 h-10 mb-2 opacity-50" />
                  <span>Configure metrics and generate plans.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerHub;


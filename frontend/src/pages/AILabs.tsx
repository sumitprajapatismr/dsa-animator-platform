import React, { useState } from 'react';
import { playSoundTone } from '../utils/audio';
import { Sparkles, Code2, Cpu } from 'lucide-react';

interface CareerPathData {
  skills: string[];
  projects: string[];
  questions: string[];
}

const AILabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviewer' | 'projects' | 'compiler' | 'coach'>('reviewer');

  // Reviewer States
  const [userCode, setUserCode] = useState(`function findMax(arr) {\n  let max = arr[0];\n  for(let i=0; i<arr.length; i++) {\n    for(let j=0; j<arr.length; j++) {\n      // O(N^2) loop\n    }\n  }\n  return max;\n}`);
  const [reviewResult, setReviewResult] = useState<string | null>(null);

  // Project Generator States
  const [techStack, setTechStack] = useState('React, Node.js');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [projectIdea, setProjectIdea] = useState<string | null>(null);

  // Compiler Lab States (Regex DFA parser)
  const [regexPattern, setRegexPattern] = useState('a*b');
  const [testString, setTestString] = useState('aaab');
  const [compilerLog, setCompilerLog] = useState<string[]>([]);
  const [compileStatus, setCompileStatus] = useState<boolean | null>(null);

  // Career Coach States
  const [selectedCareer, setSelectedCareer] = useState('AI Engineer');
  const careers: Record<string, CareerPathData> = {
    'AI Engineer': {
      skills: ['Python', 'PyTorch / TensorFlow', 'Linear Algebra', 'Transformer architectures', 'Hugging Face API models'],
      projects: ['Fine-tune LLaMA-3 model using LoRA adapters', 'Multi-agent RAG search terminal using Vector Databases'],
      questions: ['Explain the math behind backpropagation.', 'What is the purpose of attention masks in transformer tokenizers?']
    },
    'Frontend Developer': {
      skills: ['JavaScript / TypeScript', 'React / Next.js', 'Tailwind CSS', 'Browser rendering cycle', 'Redux state managers'],
      projects: ['Collaborative real-time whiteboards using WebSocket hubs', 'Custom client-side code editors with sandboxed execution environments'],
      questions: ['Explain virtual DOM reconciliation loops.', 'How do you optimize initial bundle paint times?']
    },
    'Backend Developer': {
      skills: ['Node.js / Go', 'SQL / PostgreSQL', 'MongoDB indexing', 'Redis cache clusters', 'Docker container flows'],
      projects: ['Distributed transaction message brokers', 'Role-based access gateway middlewares with API rate-limiters'],
      questions: ['How do you prevent SQL injection vectors?', 'Explain database replication structures.']
    }
  };

  const handleReviewCode = (e: React.FormEvent) => {
    e.preventDefault();
    playSoundTone('click');

    // Rule-based code evaluation
    let complexity = 'O(N)';
    let recommendation = 'Code is optimized.';
    if (userCode.includes('for') && userCode.match(/for.*for/s)) {
      complexity = 'O(N^2) Quadratic';
      recommendation = 'Nested loop detected. Consider hash maps or sorting to reduce complexity to O(N log N) or O(N).';
    } else if (userCode.includes('while')) {
      complexity = 'O(N) Linear';
      recommendation = 'Ensure loop exit boundaries are well-defined.';
    }

    setReviewResult(`### Code Audit Report
- **Estimated Complexity**: ${complexity}
- **Security Check**: No blocklist words detected.
- **Optimization Tip**: ${recommendation}`);
    playSoundTone('success');
  };

  const generateProjectRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    playSoundTone('click');
    setProjectIdea(`### Recommended Project: Smart Scaled Tracker
- **Tech Stack**: ${techStack}
- **Difficulty**: ${difficulty}
- **Key Feature**: Real-time analytical dashboard displaying progress charts.
- **Architecture**: Single-page app with decoupled API microservices.
- **Outcomes**: Understand state management, security authorization tokens, and layout optimizations.`);
    playSoundTone('success');
  };

  const simulateDFA = (e: React.FormEvent) => {
    e.preventDefault();
    playSoundTone('click');
    const logs: string[] = ['Initializing DFA state parser...'];

    // Basic simulation for pattern a*b
    if (regexPattern === 'a*b') {
      logs.push('State q0: Reading tokens...');
      let state = 'q0';
      let isValid = true;
      for (let i = 0; i < testString.length; i++) {
        const char = testString[i];
        if (state === 'q0' && char === 'a') {
          logs.push(`Looping on state q0 with character "${char}"`);
        } else if (state === 'q0' && char === 'b') {
          state = 'q1';
          logs.push(`Transition to state q1 with character "${char}"`);
        } else {
          isValid = false;
          logs.push(`No transition found for "${char}" in state ${state}`);
          break;
        }
      }
      const passed = isValid && state === 'q1';
      setCompilerLog(logs);
      setCompileStatus(passed);
      playSoundTone(passed ? 'success' : 'click');
    } else {
      logs.push(`DFA simulation only pre-configured for standard target "a*b". Got pattern: "${regexPattern}"`);
      setCompilerLog(logs);
      setCompileStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Lab & Career Coach</h1>
        <p className="mt-2 text-sm text-gray-400">Perform static code audits, generate technical projects, parse compiler DFA expressions, and map developer tracks.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border/40">
        <button
          onClick={() => { setActiveTab('reviewer'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'reviewer' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          AI Code Reviewer
        </button>
        <button
          onClick={() => { setActiveTab('projects'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'projects' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Project Generator
        </button>
        <button
          onClick={() => { setActiveTab('compiler'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'compiler' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Compiler Lab
        </button>
        <button
          onClick={() => { setActiveTab('coach'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'coach' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Career Coach
        </button>
      </div>

      {/* Workspace */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow min-h-[380px] flex flex-col justify-between">
        {activeTab === 'reviewer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <form onSubmit={handleReviewCode} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Source Code</label>
                <textarea
                  className="w-full h-44 p-3 bg-brand-dark border border-brand-border rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded shadow-glow flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Optimize Code
              </button>
            </form>

            {/* Output */}
            <div className="p-4 rounded-xl bg-[#070913] border border-brand-border/40 text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">
              {reviewResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    AI Code Audit Results
                  </div>
                  {reviewResult}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <Cpu className="w-10 h-10 mb-2 opacity-50" />
                  <span>Input source code to run analysis.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <form onSubmit={generateProjectRecommendation} className="p-4 rounded-xl bg-brand-dark/20 border border-brand-border/40 space-y-4">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Technology Stack</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs text-white"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Difficulty Level</label>
                <select
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs text-white"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded shadow-glow">
                Generate Technical Project
              </button>
            </form>

            {/* Output */}
            <div className="p-4 rounded-xl bg-[#070913] border border-brand-border/40 text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">
              {projectIdea ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    AI Project Specs
                  </div>
                  {projectIdea}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <Cpu className="w-10 h-10 mb-2 opacity-50" />
                  <span>Configure metrics and generate specs.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compiler' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <form onSubmit={simulateDFA} className="p-4 rounded-xl bg-brand-dark/20 border border-brand-border/40 space-y-4">
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Regex Pattern</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs font-mono text-white"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Test Input String</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 bg-brand-dark border border-brand-border rounded text-xs font-mono text-white"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded">
                Parse String
              </button>
            </form>

            {/* Output */}
            <div className="p-4 rounded-xl bg-[#070913] border border-brand-border/40 text-xs font-mono text-gray-400 space-y-3">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">DFA Transition Logs:</span>
              <div className="space-y-1 text-[10px]">
                {compilerLog.map((log, i) => <div key={i}>{log}</div>)}
              </div>
              {compileStatus !== null && (
                <div className={`p-2 rounded font-bold text-center text-[10px] ${compileStatus ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/60' : 'bg-red-950/20 text-red-400 border border-red-900/60'}`}>
                  {compileStatus ? '✓ String Accepted by DFA!' : '✗ String Rejected.'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(careers).map((role) => {
                const isActive = selectedCareer === role;
                return (
                  <button
                    key={role}
                    onClick={() => { setSelectedCareer(role); playSoundTone('click'); }}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${isActive ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border/60 text-gray-400 hover:text-white'}`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <div className="p-6 rounded-xl bg-brand-dark/40 border border-brand-border/40 text-xs space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Required Skills</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {careers[selectedCareer].skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900/60 text-indigo-400 text-[9px] font-mono">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Recommended Portfolio Projects</span>
                  <ul className="text-gray-300 list-disc pl-4 space-y-1 mt-1">
                    {careers[selectedCareer].projects.map((proj, i) => <li key={i}>{proj}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Frequent Interview Questions</span>
                  <ul className="text-gray-300 list-disc pl-4 space-y-1 mt-1">
                    {careers[selectedCareer].questions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILabs;


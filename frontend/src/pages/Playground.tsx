import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUserStats } from '../features/authSlice';
import { Play, Send, Sparkles, MessageSquare, Award, ArrowLeft, RefreshCw, Terminal } from 'lucide-react';
import api from "../utils/api";
interface ProblemDetail {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation: string }>;
  codeTemplates: Array<{ language: string; template: string }>;
}

const Playground: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  // Terminal console state
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Tutor overlay states
  const [aiActiveTab, setAiActiveTab] = useState<'review' | 'hint' | 'chat' | 'interview'>('chat');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewTopic, setInterviewTopic] = useState('Arrays & Searching');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/api/problems/${slug}`);
        setProblem(res.data.problem);
        
        // Load initial template
        const jsTemplate = res.data.problem.codeTemplates.find((t: any) => t.language === 'javascript');
        setCode(jsTemplate ? jsTemplate.template : '');
      } catch (err) {
        console.error('Error fetching problem details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  // Sync editor when language selection changes
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (problem) {
      const templateObj = problem.codeTemplates.find((t) => t.language === lang);
      setCode(templateObj ? templateObj.template : '');
    }
  };

  // Run user code against custom input
  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOutput('Running compiler execution...');
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/problems/run', {
        code,
        language,
        input: consoleInput || problem.examples[0]?.input || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { status, output, error, runtime } = res.data.result;
      if (status === 'Compile Error' || status === 'Runtime Error') {
        setConsoleOutput(`❌ ${status}:\n${error}`);
      } else {
        setConsoleOutput(`🟢 Executed Successfully!\n\nOutput:\n${output}\n\nTime: ${runtime}ms`);
      }
    } catch (err: any) {
      setConsoleOutput(`Error running code: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code against all test cases
  const handleSubmitCode = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setConsoleOutput('Executing submissions against validation tests...');
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/api/problems/${problem._id}/submit`, {
        code,
        language
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { submission, passed, total, xpGained, coinsGained, error } = res.data;
      if (submission.status === 'Accepted') {
        setConsoleOutput(`🎉 ACCEPTED!\nPassed ${passed}/${total} test cases.\nRuntime: ${submission.runtime}ms\n\nReward: +${xpGained} XP & +${coinsGained} Coins!`);
        
        // Update user profile stats in Redux
        if (xpGained > 0) {
          const userObj = JSON.parse(localStorage.getItem('user')!);
          dispatch(updateUserStats({
            xp: userObj.xp + xpGained,
            coins: userObj.coins + coinsGained,
            level: Math.floor(Math.sqrt((userObj.xp + xpGained) / 100)) + 1
          }));
        }
      } else {
        setConsoleOutput(`❌ ${submission.status}:\nPassed ${passed}/${total} test cases.\n\nDetails:\n${error}`);
      }
    } catch (err: any) {
      setConsoleOutput(`Error submitting code: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${problem?.slug || 'code'}.${language === 'javascript' ? 'js' : 'py'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAIInterview = async (reset = false) => {
    setAiLoading(true);
    const token = localStorage.getItem('token');
    const step = reset ? 0 : interviewStep;
    if (reset) {
      setInterviewStep(0);
    }
    setAiOutput('AI Interviewer is evaluating...');

    try {
      const res = await api.post('/api/ai/interview', {
        currentStep: step,
        userResponse: code,
        topic: interviewTopic
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAiOutput(res.data.response);
      setInterviewStep(res.data.nextStep);
    } catch (err: any) {
      setAiOutput(`Failed to load interview context: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // AI request helpers
  const handleAIQuery = async (action: 'review' | 'hint' | 'chat' | 'interview') => {
    if (action === 'interview') {
      return handleAIInterview();
    }
    setAiLoading(true);
    setAiOutput('Querying AI Assistant...');
    const token = localStorage.getItem('token');

    try {
      if (action === 'review') {
        const res = await api.post('/api/ai/review', { code, language }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAiOutput(res.data.review);
      } else if (action === 'hint') {
        const res = await api.post('/api/ai/hint', {
          problemTitle: problem?.title,
          problemDescription: problem?.description,
          code,
          language
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAiOutput(res.data.hint);
      } else {
        // Chat prompt
        const res = await api.post('/api/ai/ask', {
          prompt: aiPrompt,
          context: `Problem: ${problem?.title}. User code:\n${code}`
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAiOutput(res.data.response);
        setAiPrompt('');
      }
    } catch (err: any) {
      setAiOutput(`Failed to fetch AI feedback: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading code workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] overflow-hidden gap-4">
      {/* Back navigation header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/problems')}
          className="flex items-center text-sm font-semibold text-gray-400 hover:text-white transition-colors gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Problem Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            Copy
          </button>
          <button
            onClick={handleDownloadCode}
            className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            title="Download Code"
          >
            Download
          </button>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border focus:outline-none focus:border-indigo-500 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* Split view workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: Problem Statement & AI assistant */}
        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-2">
          {/* Details */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
            <h1 className="text-2xl font-black">{problem.title}</h1>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded bg-brand-dark text-indigo-400 border border-brand-border uppercase">
              Difficulty: {problem.difficulty}
            </span>
            <div className="mt-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </div>

            {problem.constraints.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Constraints</h4>
                <ul className="list-disc pl-5 text-xs text-gray-400 space-y-1">
                  {problem.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                </ul>
              </div>
            )}

            {problem.examples.map((ex, idx) => (
              <div key={idx} className="mt-6 p-4 rounded-xl bg-brand-dark/40 border border-brand-border/40">
                <h4 className="text-xs font-bold text-gray-400 uppercase">Example {idx + 1}</h4>
                <div className="mt-2 text-xs font-mono space-y-1.5">
                  <div><span className="text-gray-500">Input:</span> {ex.input}</div>
                  <div><span className="text-gray-500">Output:</span> {ex.output}</div>
                  {ex.explanation && <div><span className="text-gray-500">Explanation:</span> {ex.explanation}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* AI Assistant widget */}
          <div className="p-6 rounded-2xl bg-[#0E1626] border border-brand-border shadow-glow flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                AI Tutor Workspace
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => { setAiActiveTab('chat'); setAiOutput(''); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${aiActiveTab === 'chat' ? 'bg-indigo-600' : 'bg-brand-card hover:bg-brand-border text-gray-400'}`}
                >
                  Ask Tutor
                </button>
                <button
                  onClick={() => { setAiActiveTab('review'); handleAIQuery('review'); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${aiActiveTab === 'review' ? 'bg-indigo-600' : 'bg-brand-card hover:bg-brand-border text-gray-400'}`}
                >
                  Review Code
                </button>
                <button
                  onClick={() => { setAiActiveTab('hint'); handleAIQuery('hint'); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${aiActiveTab === 'hint' ? 'bg-indigo-600' : 'bg-brand-card hover:bg-brand-border text-gray-400'}`}
                >
                  Get Hint
                </button>
                <button
                  onClick={() => { setAiActiveTab('interview'); handleAIInterview(true); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${aiActiveTab === 'interview' ? 'bg-indigo-600' : 'bg-brand-card hover:bg-brand-border text-gray-400'}`}
                >
                  AI Interview
                </button>
              </div>
            </div>

            {/* AI Output Console */}
            <div className="flex-1 overflow-y-auto max-h-48 text-xs text-gray-400 bg-brand-dark/40 p-4 rounded-xl border border-brand-border/40 whitespace-pre-wrap leading-relaxed">
              {aiOutput || (aiActiveTab === 'interview' ? 'Configure topic and click Start Session to begin technical mock review. Your editor contents will be evaluated as your code response.' : 'Click Review Code or Get Hint to generate AI insights, or chat directly below.')}
            </div>

            {aiActiveTab === 'chat' && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a clarifying question (e.g., 'What is time complexity of my loops?')"
                  className="flex-1 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIQuery('chat')}
                />
                <button
                  onClick={() => handleAIQuery('chat')}
                  disabled={aiLoading || !aiPrompt}
                  className="px-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-xs font-semibold flex items-center justify-center disabled:opacity-40"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            )}

            {aiActiveTab === 'interview' && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span className="flex items-center">Topic: 
                    <select
                      value={interviewTopic}
                      onChange={(e) => setInterviewTopic(e.target.value)}
                      className="ml-1 px-2 py-0.5 bg-brand-dark border border-brand-border rounded text-[10px] text-gray-300 focus:outline-none"
                    >
                      <option value="Arrays & Searching">Arrays & Searching</option>
                      <option value="Sorting Algorithms">Sorting Algorithms</option>
                      <option value="Linked Lists">Linked Lists</option>
                    </select>
                  </span>
                  <span>Session Step: {interviewStep} / 3</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAIInterview(false)}
                    disabled={aiLoading || interviewStep >= 3}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold disabled:opacity-40"
                  >
                    {interviewStep === 0 ? 'Start Interview Session' : interviewStep === 2 ? 'Submit Implementation Code' : 'Next Question'}
                  </button>
                  {interviewStep > 0 && (
                    <button
                      onClick={() => handleAIInterview(true)}
                      className="px-3 py-2 bg-brand-card hover:bg-brand-border border border-brand-border rounded-lg text-xs font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco Editor and compiler output console */}
        <div className="flex flex-col min-h-0">
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 border border-brand-border rounded-t-2xl overflow-hidden relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'javascript' ? 'javascript' : 'python'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {/* Console Output Terminal */}
          <div className="h-48 bg-[#0B0F19] border-x border-b border-brand-border p-4 flex flex-col min-h-[120px] rounded-b-2xl">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-2 mb-3">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Execution Console
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom Input (E.g. 2,7,11,15\n9)"
                  className="px-3 py-1 bg-brand-dark border border-brand-border rounded text-xs text-gray-300 focus:outline-none focus:border-indigo-500 w-44 hidden md:block"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                />
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1 bg-[#111A2C] border border-brand-border hover:border-indigo-500/50 px-3 py-1 text-xs font-bold rounded-lg text-gray-400 hover:text-white transition-all disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5" /> Run Code
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 text-xs font-bold rounded-lg text-white transition-all shadow-glow disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Code
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-brand-dark/50 rounded-xl p-3 border border-brand-border/30 text-xs font-mono text-gray-400 whitespace-pre-wrap">
              {consoleOutput || 'Run or submit code to compile output and check test cases.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;


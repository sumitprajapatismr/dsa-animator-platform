import React, { useState } from 'react';
import { playSoundTone } from '../utils/audio';
import { BookOpen, Terminal, Sparkles, Cpu, Globe } from 'lucide-react';

interface SubjectInfo {
  name: string;
  roadmap: string[];
  vivaQuestions: string[];
  quiz: {
    question: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  };
  analogy: string;
  expectedComplexity: string;
}

const CSSubjects: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'OS' | 'DBMS' | 'CN' | 'SystemDesign' | 'CompilerDesign'>('OS');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'simulation' | 'quiz' | 'aiCoach'>('roadmap');

  // CPU Scheduling simulator state (OS)
  const [burstTimes, setBurstTimes] = useState([5, 2, 8]);
  const [ganttChart, setGanttChart] = useState<string[]>([]);
  const [simulating, setSimulating] = useState(false);

  // SQL query state (DBMS)
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM Users WHERE level > 3');
  const [queryResult, setQueryResult] = useState<Array<Record<string, any>>>([
    { id: 1, name: 'Alice', level: 5 },
    { id: 2, name: 'Bob', level: 4 }
  ]);

  // Quiz State
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // AI Teacher State
  const [teachMode, setTeachMode] = useState<'Simple' | 'Mathematical' | 'Interview' | 'Kids'>('Simple');
  const [coachResponse, setCoachResponse] = useState('Welcome! Ask the AI Teacher to explain this topic in any format.');

  const subjects: Record<'OS' | 'DBMS' | 'CN' | 'SystemDesign' | 'CompilerDesign', SubjectInfo> = {
    OS: {
      name: 'Operating Systems',
      roadmap: ['Process Management & Threads', 'CPU Scheduling algorithms (FIFO, SJF, Round Robin)', 'Deadlock Prevention & Detection', 'Virtual Memory & Paging Pages'],
      vivaQuestions: ['What is thrashing in paging?', 'Explain the difference between mutex and semaphores.'],
      quiz: {
        question: 'Which scheduling algorithm is non-preemptive by default?',
        options: ['Shortest Job First (SJF) standard', 'Round Robin', 'Priority Scheduling preemptive', 'Multi-level Queue'],
        answerIdx: 0,
        explanation: 'SJF standard is non-preemptive unless explicitly specified as Shortest Remaining Time First (SRTF).'
      },
      analogy: 'The CPU scheduler is like a chef deciding which recipe to cook first in a restaurant kitchen.',
      expectedComplexity: 'Time: O(N log N) for priority based schedulers, Space: O(N) queue space.'
    },
    DBMS: {
      name: 'Database Management Systems',
      roadmap: ['Relational Database Models', 'SQL Queries & Subqueries', 'Database Normalization (1NF, 2NF, 3NF, BCNF)', 'ACID transactions & Concurrency control'],
      vivaQuestions: ['What is the difference between 3NF and BCNF?', 'Explain write-ahead logging (WAL) benefits.'],
      quiz: {
        question: 'Which transaction isolation level avoids dirty reads but permits non-repeatable reads?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        answerIdx: 1,
        explanation: 'Read Committed level prevents dirty reads by ensuring only committed data is read, but non-repeatable reads can still happen.'
      },
      analogy: 'Normalization is like sorting a cluttered closet into labeled drawers to reduce duplicate items.',
      expectedComplexity: 'Time: O(Log N) B-Tree indexing retrieval, Space: O(N) storage records.'
    },
    CN: {
      name: 'Computer Networks',
      roadmap: ['OSI 7-Layer Architecture Model', 'TCP/IP Protocol Suites', 'Routing Algorithms (Link State vs Distance Vector)', 'IP Subnetting & Network CIDR masks'],
      vivaQuestions: ['What is the difference between TCP and UDP?', 'Explain DNS lookup stages.'],
      quiz: {
        question: 'Which layer of the OSI model handles logical addressing and routing packets?',
        options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        answerIdx: 2,
        explanation: 'The Network Layer handles logical IP addresses and routes packets across networks.'
      },
      analogy: 'Subnetting is like dividing a large apartment building into individual flat numbers for post deliveries.',
      expectedComplexity: 'Time: O(V log V + E) Dijkstra Link-state routing, Space: O(V) route mapping entries.'
    },
    SystemDesign: {
      name: 'System Design',
      roadmap: ['Horizontal vs Vertical Scaling', 'Load Balancers & Reverse Proxies', 'Consistent Hashing Rings', 'Microservices vs Monolith architectures'],
      vivaQuestions: ['What is consistent hashing?', 'Explain CAP theorem tradeoffs.'],
      quiz: {
        question: 'Which component distributes incoming traffic across multiple backend servers?',
        options: ['CDN Cache', 'Load Balancer', 'Reverse Proxy', 'Database Replica'],
        answerIdx: 1,
        explanation: 'A Load Balancer is dedicated to distributing traffic across servers to optimize resource utilization.'
      },
      analogy: 'Consistent Hashing is like assigning tasks to people sitting on a spinning carousel.',
      expectedComplexity: 'Time: O(Log K) ring traversal, Space: O(K) active node weights.'
    },
    CompilerDesign: {
      name: 'Compiler Design',
      roadmap: ['Lexical Analysis & DFA tokens', 'LL(1) and LR(1) Syntax parsers', 'Semantic validation tree checks', 'Intermediate Code Generation (TAC)'],
      vivaQuestions: ['What is a token in lexical analysis?', 'Explain syntax directed translation (SDT).'],
      quiz: {
        question: 'Which compiler phase converts characters into meaningful streams of tokens?',
        options: ['Lexical Analyzer', 'Syntax Parser', 'Code Optimizer', 'Semantic Analyzer'],
        answerIdx: 0,
        explanation: 'The Lexical Analyzer reads source characters and groups them into logical tokens.'
      },
      analogy: 'Lexical analysis is like reading a recipe book and highlighting all key ingredients (verbs and nouns).',
      expectedComplexity: 'Time: O(N) string token scans, Space: O(N) parse trees nodes.'
    }
  };

  const handleSubjectSelect = (sub: 'OS' | 'DBMS' | 'CN' | 'SystemDesign' | 'CompilerDesign') => {
    setSelectedSubject(sub);
    setActiveTab('roadmap');
    setUserAnswer(null);
    setQuizSubmitted(false);
    playSoundTone('click');
  };

  const runCPUSchedulingSim = () => {
    setSimulating(true);
    setGanttChart([]);
    playSoundTone('click');

    setTimeout(() => {
      const chart: string[] = [];
      let time = 0;
      burstTimes.forEach((burst, idx) => {
        chart.push(`P${idx + 1} (${time}ms - ${time + burst}ms)`);
        time += burst;
      });
      setGanttChart(chart);
      setSimulating(false);
      playSoundTone('success');
    }, 1200);
  };

  const executeMockSQL = () => {
    playSoundTone('click');
    if (sqlQuery.toLowerCase().includes('where')) {
      setQueryResult([
        { id: 1, name: 'Alice', level: 5 },
        { id: 2, name: 'Bob', level: 4 }
      ]);
    } else {
      setQueryResult([
        { id: 1, name: 'Alice', level: 5 },
        { id: 2, name: 'Bob', level: 4 },
        { id: 3, name: 'Charlie', level: 2 }
      ]);
    }
  };

  const handleTeacherQuery = (mode: 'Simple' | 'Mathematical' | 'Interview' | 'Kids') => {
    setTeachMode(mode);
    playSoundTone('click');

    if (mode === 'Simple') {
      setCoachResponse(`AI Teacher: ${subjects[selectedSubject].analogy}`);
    } else if (mode === 'Mathematical') {
      setCoachResponse(`AI Teacher: Theoretical resource distribution formulas: ${subjects[selectedSubject].expectedComplexity}`);
    } else if (mode === 'Interview') {
      setCoachResponse(`AI Teacher: Essential Viva Focus: "${subjects[selectedSubject].vivaQuestions[0]}"`);
    } else {
      setCoachResponse('AI Teacher: Think of it like swapping seats on a magic school bus!');
    }
  };

  const activeSubject = subjects[selectedSubject];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Computer Science Academy</h1>
        <p className="text-xs text-gray-400 mt-1">Prepare core CS subjects with process scheduling simulators, OSI model visualizations, and interactive AI teacher dialog blocks.</p>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.keys(subjects) as Array<'OS' | 'DBMS' | 'CN' | 'SystemDesign' | 'CompilerDesign'>).map((subKey) => {
          const isActive = selectedSubject === subKey;
          return (
            <button
              key={subKey}
              onClick={() => handleSubjectSelect(subKey)}
              className={`p-4 rounded-xl border text-left transition-all ${isActive ? 'bg-indigo-650/10 border-indigo-500 shadow-glow' : 'bg-brand-card border-brand-border/60'}`}
            >
              <BookOpen className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="text-xs font-bold text-white leading-tight truncate">{subjects[subKey].name}</h3>
              <p className="text-[9px] text-gray-500 mt-1">{subjects[subKey].roadmap.length} Chapters</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border/40 text-xs">
        <button
          onClick={() => { setActiveTab('roadmap'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'roadmap' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Chapters Roadmap
        </button>
        <button
          onClick={() => { setActiveTab('simulation'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'simulation' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Interactive Simulation
        </button>
        <button
          onClick={() => { setActiveTab('quiz'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'quiz' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          MCQ Checkpoint
        </button>
        <button
          onClick={() => { setActiveTab('aiCoach'); playSoundTone('click'); }}
          className={`px-4 py-2.5 font-bold uppercase border-b-2 transition-all ${activeTab === 'aiCoach' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          AI Teacher Assistant
        </button>
      </div>

      {/* Workspace Area */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow min-h-[340px] flex flex-col justify-between">
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-3">Roadmap Flow</h3>
              <div className="space-y-2">
                {activeSubject.roadmap.map((chapter, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-brand-dark/40 border border-brand-border/40 rounded-xl text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-650 flex items-center justify-center font-bold text-[9px] text-indigo-400">{idx + 1}</span>
                    <span className="text-gray-300 font-semibold">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-border/40 pt-4">
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-purple-400 mb-2">Viva Prep Check:</h4>
              <ul className="text-xs text-gray-400 space-y-1 pl-4 list-disc">
                {activeSubject.vivaQuestions.map((q, idx) => <li key={idx}>{q}</li>)}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {selectedSubject === 'OS' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5"><Cpu className="w-4 h-4" /> CPU Scheduling Simulator (FCFS)</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Burst P1</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-brand-dark border border-brand-border rounded"
                      value={burstTimes[0]}
                      onChange={(e) => setBurstTimes([Number(e.target.value), burstTimes[1], burstTimes[2]])}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Burst P2</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-brand-dark border border-brand-border rounded"
                      value={burstTimes[1]}
                      onChange={(e) => setBurstTimes([burstTimes[0], Number(e.target.value), burstTimes[2]])}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Burst P3</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-brand-dark border border-brand-border rounded"
                      value={burstTimes[2]}
                      onChange={(e) => setBurstTimes([burstTimes[0], burstTimes[1], Number(e.target.value)])}
                    />
                  </div>
                </div>

                <button
                  onClick={runCPUSchedulingSim}
                  disabled={simulating}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white shadow-glow"
                >
                  {simulating ? 'Calculating Gantt Timeline...' : 'Animate Scheduling'}
                </button>

                {ganttChart.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Gantt Chart Output:</span>
                    <div className="flex flex-wrap gap-2">
                      {ganttChart.map((step, idx) => (
                        <div key={idx} className="p-3 bg-indigo-950 border border-indigo-900/60 rounded-xl text-[10px] font-mono text-indigo-400">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedSubject === 'DBMS' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5"><Terminal className="w-4 h-4" /> SQL Playground Console</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 bg-brand-dark border border-brand-border rounded-lg text-xs font-mono text-white"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                  />
                  <button
                    onClick={executeMockSQL}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white"
                  >
                    Run Query
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold block">Console Result Output:</span>
                  <div className="p-3 rounded-lg bg-[#070913] border border-brand-border/40 overflow-x-auto text-[10px] font-mono text-emerald-400">
                    <pre>{JSON.stringify(queryResult, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {(selectedSubject === 'CN' || selectedSubject === 'SystemDesign' || selectedSubject === 'CompilerDesign') && (
              <div className="space-y-4 text-center py-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1.5"><Globe className="w-4 h-4 animate-spin" /> Flow Architecture Simulator</h3>
                <div className="flex flex-col items-center space-y-2">
                  <div className="px-3 py-1 bg-brand-dark border border-brand-border rounded text-[10px] text-gray-300">Front Controller</div>
                  <div className="h-4 w-0.5 bg-brand-border" />
                  <div className="px-3 py-1 bg-brand-dark border border-brand-border rounded text-[10px] text-gray-300">Semantic Checker</div>
                  <div className="h-4 w-0.5 bg-brand-border" />
                  <div className="px-3 py-1 bg-brand-dark border border-indigo-500/40 rounded text-[10px] text-indigo-400 border-indigo-500/40 animate-pulse">Logical IP Subnet Router</div>
                  <div className="h-4 w-0.5 bg-brand-border" />
                  <div className="px-3 py-1 bg-brand-dark border border-brand-border rounded text-[10px] text-gray-300">Physical Storage Replica</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Topic MCQ Checkpoint</h3>
              <p className="text-xs text-gray-300 font-semibold mb-4">{activeSubject.quiz.question}</p>
              <div className="space-y-2">
                {activeSubject.quiz.options.map((opt, oIdx) => {
                  let btnStyle = 'bg-brand-dark border-brand-border/60 text-gray-400 hover:text-white';
                  if (quizSubmitted) {
                    if (oIdx === activeSubject.quiz.answerIdx) {
                      btnStyle = 'bg-emerald-950/20 border-emerald-900/60 text-emerald-400';
                    } else if (userAnswer === oIdx) {
                      btnStyle = 'bg-red-950/20 border-red-900/60 text-red-400';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizSubmitted}
                      onClick={() => {
                        setUserAnswer(oIdx);
                        setQuizSubmitted(true);
                        playSoundTone(oIdx === activeSubject.quiz.answerIdx ? 'success' : 'click');
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {quizSubmitted && (
              <div className="p-4 rounded-xl bg-brand-dark border border-brand-border/40 text-[10px] text-gray-400">
                <span className={`font-bold block mb-1 ${userAnswer === activeSubject.quiz.answerIdx ? 'text-emerald-400' : 'text-red-400'}`}>
                  {userAnswer === activeSubject.quiz.answerIdx ? '✓ Correct Answer!' : '✗ Incorrect.'}
                </span>
                {activeSubject.quiz.explanation}
              </div>
            )}
          </div>
        )}

        {activeTab === 'aiCoach' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4 animate-pulse" /> AI Academy Teacher</h3>
            
            <div className="flex gap-2">
              {(['Simple', 'Mathematical', 'Interview', 'Kids'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleTeacherQuery(mode)}
                  className={`flex-1 py-1.5 rounded text-[10px] font-bold border capitalize ${teachMode === mode ? 'bg-indigo-650 text-white' : 'bg-brand-dark border-brand-border/60 text-gray-400 hover:text-white'}`}
                >
                  {mode} Mode
                </button>
              ))}
            </div>

            <div className="p-4 bg-brand-dark/40 border border-brand-border/40 rounded-xl text-xs text-gray-300 leading-relaxed">
              {coachResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSSubjects;

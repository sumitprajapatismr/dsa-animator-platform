import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Code2, ShieldAlert, Award, ArrowRight, CheckCircle2, XCircle, HelpCircle, ChevronDown, Github, Linkedin, Heart } from 'lucide-react';

const Welcome: React.FC = () => {
  // Live Demo Section Tab State
  const [demoTab, setDemoTab] = useState<'sort' | 'tree' | 'ai'>('sort');
  
  // Sorting Demo State
  const [sortArray, setSortArray] = useState([50, 20, 80, 40, 10]);
  const [sortStep, setSortStep] = useState(0);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Company Selector State
  const [selectedCompany, setSelectedCompany] = useState('Google');

  const stepSortDemo = () => {
    const nextArr = [...sortArray];
    if (sortStep === 0) {
      // Swap 50 and 20
      nextArr[0] = 20;
      nextArr[1] = 50;
      setSortStep(1);
    } else if (sortStep === 1) {
      // Swap 50 and 40 (after comparing with 80)
      nextArr[2] = 40;
      nextArr[3] = 80;
      setSortStep(2);
    } else {
      // Reset
      setSortArray([50, 20, 80, 40, 10]);
      setSortStep(0);
    }
    setSortArray(nextArr);
  };

  const faqs = [
    { q: 'What is Brain DSA AI?', a: 'Brain DSA AI is a premium learning ecosystem that combines real-time visualizers, AI mentors, code playgrounds, and career placement tools.' },
    { q: 'How does the AI Tutor work?', a: 'Our floating AI assistant leverages advanced generative models to explain algorithms, suggest progressive hints, and dry-run code.' },
    { q: 'Is the platform free?', a: 'Yes! The base visualizer, code editor, and standard practice problems are free. Premium mock interviews and advanced AI roadmaps are accessible via coins.' },
    { q: 'Which programming languages are supported?', a: 'We support compilation and running for Java, Python, C++, JavaScript, and C.' }
  ];

  const companiesData: Record<string, { path: string; topics: string; difficulty: string; time: string }> = {
    Google: { path: 'Graphs & Advanced DP recursion', topics: 'DFS, Topological Sort, Segment Trees', difficulty: 'Hard', time: '12 Weeks' },
    Amazon: { path: 'Trees, Heaps, System Designs', topics: 'BST Traversals, Priority Queues, LRU cache', difficulty: 'Medium-Hard', time: '10 Weeks' },
    Microsoft: { path: 'Arrays, Strings, Linked Lists', topics: 'Sliding Window, Hash Tables, Two Pointers', difficulty: 'Medium', time: '8 Weeks' }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-gray-100 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070913]/80 backdrop-blur-md border-b border-brand-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center border border-indigo-500/40">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">Brain DSA AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-glow uppercase tracking-wider">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-28 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Soft glowing bubbles */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative space-y-6 max-w-4xl">
          <span className="px-3 py-1 bg-indigo-950/40 border border-indigo-900/40 rounded-full text-[10px] uppercase font-bold tracking-widest text-indigo-400 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Learning Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            🧠 Brain DSA AI
          </h1>
          <p className="text-indigo-400 font-bold tracking-widest text-sm uppercase">
            Learn • Visualize • Practice • Master
          </p>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Master Data Structures & Algorithms with AI-powered visualizers, sandbox code testing, personalized roadmaps, mock recruiter interviews, and real-time skill scorecards.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-glow transition-all flex items-center gap-1"
            >
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-brand-card hover:bg-brand-border border border-brand-border text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all"
            >
              Explore Visualizer
            </Link>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Live Interactive Previews</h2>
          <p className="text-xs text-gray-400">Experience our custom visualizer directly from your landing dashboard.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex justify-center border-b border-brand-border/40">
          <button
            onClick={() => setDemoTab('sort')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${demoTab === 'sort' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
          >
            Sorting Demo
          </button>
          <button
            onClick={() => setDemoTab('tree')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${demoTab === 'tree' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
          >
            Binary Tree
          </button>
          <button
            onClick={() => setDemoTab('ai')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${demoTab === 'ai' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
          >
            AI Recruiter
          </button>
        </div>

        {/* Tab panels */}
        <div className="p-6 rounded-2xl bg-[#090D18] border border-brand-border/60 shadow-glow min-h-[300px] flex flex-col justify-between">
          {demoTab === 'sort' && (
            <div className="space-y-6">
              <div className="h-44 flex items-end justify-center gap-3 pb-4">
                {sortArray.map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${val}%` }}
                    className="w-10 bg-indigo-600 rounded-t-lg flex items-center justify-center transition-all duration-500 shadow-glow"
                  >
                    <span className="text-[10px] font-bold text-white mb-2">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Step {sortStep} of sorting bubble passes.</span>
                <button
                  onClick={stepSortDemo}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg"
                >
                  Swap / Step Next
                </button>
              </div>
            </div>
          )}

          {demoTab === 'tree' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <svg className="w-full max-w-sm h-32 overflow-visible">
                {/* Node coordinates */}
                <line x1="160" y1="20" x2="100" y2="80" stroke="#23324C" strokeWidth="2" />
                <line x1="160" y1="20" x2="220" y2="80" stroke="#23324C" strokeWidth="2" />
                
                <circle cx="160" cy="20" r="16" fill="#6366F1" className="animate-pulse" />
                <text x="160" y="24" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">10 (Root)</text>

                <circle cx="100" cy="80" r="16" fill="#10B981" />
                <text x="100" y="84" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">5</text>

                <circle cx="220" cy="80" r="16" fill="#10B981" />
                <text x="220" y="84" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">15</text>
              </svg>
              <p className="text-xs text-gray-500">Self-balancing Binary Search Tree node distribution preview.</p>
            </div>
          )}

          {demoTab === 'ai' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-brand-dark/80 border border-brand-border/40 text-gray-400 space-y-2">
                <p className="text-indigo-400 font-bold">&gt; AI Recruiter: Explain DFS post-order traversals.</p>
                <p>&gt; Candidate: Post-order processes children branches (left, right) before completing root node metrics.</p>
                <p className="text-emerald-400 font-bold">&gt; AI Recruiter Evaluation: Correct logic sequence! +10 Elo Rating.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-brand-card/20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Full-Stack Features</h2>
            <p className="text-xs text-gray-400">Everything you need to master interviews in one integrated portal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border/60 hover:border-indigo-500/50 hover:shadow-glow transition-all">
              <Sparkles className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="text-base font-bold text-white">Interactive AI Tutor</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Get hints, dry runs, edge case analyses, and complexity explanations instantly.</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border/60 hover:border-indigo-500/50 hover:shadow-glow transition-all">
              <Play className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="text-base font-bold text-white">Algorithm Story Mode</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Learn DSA arrays, stacks, and search loops using relatable real-life metaphors.</p>
            </div>
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border/60 hover:border-indigo-500/50 hover:shadow-glow transition-all">
              <Code2 className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="text-base font-bold text-white">ATS Resume Labs</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Optimize CV keywords to bypass standard corporate ATS filters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Brain DSA AI Comparison Table */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Why Brain DSA AI?</h2>
          <p className="text-xs text-gray-400">Compare standard textbooks with our interactive learning pipeline.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-brand-border/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-card border-b border-brand-border text-gray-400 uppercase font-bold">
                <th className="p-4">Feature Metric</th>
                <th className="p-4">Traditional Books</th>
                <th className="p-4 text-indigo-400">Brain DSA AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-gray-300">
              <tr className="hover:bg-brand-card/10">
                <td className="p-4 font-bold">Algorithmic Playback</td>
                <td className="p-4 flex items-center gap-1.5 text-red-400"><XCircle className="w-4 h-4" /> Static Pages</td>
                <td className="p-4 text-emerald-400"><CheckCircle2 className="w-4 h-4 inline mr-1" /> Dynamic SVG Timelines</td>
              </tr>
              <tr className="hover:bg-brand-card/10">
                <td className="p-4 font-bold">Recruiter Mentoring</td>
                <td className="p-4 flex items-center gap-1.5 text-red-400"><XCircle className="w-4 h-4" /> None</td>
                <td className="p-4 text-emerald-400"><CheckCircle2 className="w-4 h-4 inline mr-1" /> Live AI Recruiter Scorecards</td>
              </tr>
              <tr className="hover:bg-brand-card/10">
                <td className="p-4 font-bold">Paced Study Guides</td>
                <td className="p-4 flex items-center gap-1.5 text-red-400"><XCircle className="w-4 h-4" /> Generic Schedules</td>
                <td className="p-4 text-emerald-400"><CheckCircle2 className="w-4 h-4 inline mr-1" /> Personal 30-90 Day Paths</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Learning Journey roadmap flow */}
      <section className="py-20 bg-brand-card/20 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">Visual Study Journey</h2>
            <p className="text-xs text-gray-400">The progressive hierarchy to master interview questions.</p>
          </div>

          <div className="flex flex-col items-center space-y-4 font-bold text-xs uppercase tracking-wider text-gray-400">
            <div className="px-4 py-2.5 rounded-lg bg-indigo-950 border border-indigo-900/60 text-indigo-400">1. Arrays & Sorting</div>
            <div className="h-6 w-0.5 bg-brand-border" />
            <div className="px-4 py-2.5 rounded-lg bg-indigo-950 border border-indigo-900/60 text-indigo-400">2. Linked Lists & Stacks</div>
            <div className="h-6 w-0.5 bg-brand-border" />
            <div className="px-4 py-2.5 rounded-lg bg-indigo-950 border border-indigo-900/60 text-indigo-400">3. Binary Trees & Graphs</div>
            <div className="h-6 w-0.5 bg-brand-border" />
            <div className="px-4 py-2.5 rounded-lg bg-indigo-950 border border-indigo-900/60 text-indigo-400">4. Dynamic Programming</div>
          </div>
        </div>
      </section>

      {/* Company Preparation */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Company Recruiter Paths</h2>
          <p className="text-xs text-gray-400">Select target companies to read custom focus metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(companiesData).map((comp) => {
            const isActive = selectedCompany === comp;
            return (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                className={`p-6 rounded-2xl border text-left transition-all ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-glow' : 'bg-brand-card border-brand-border/60'}`}
              >
                <h4 className="font-bold text-white text-sm">{comp} Prep</h4>
                <p className="text-[10px] text-gray-400 mt-2">Estimation: {companiesData[comp].time}</p>
              </button>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-[#090D18] border border-brand-border text-xs space-y-3">
          <p><span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] block">Recommended Study:</span> {companiesData[selectedCompany].path}</p>
          <p><span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] block">High Frequency:</span> {companiesData[selectedCompany].topics}</p>
          <p><span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] block">Difficulty index:</span> {companiesData[selectedCompany].difficulty}</p>
        </div>
      </section>

      {/* Brain Score circular preview */}
      <section className="py-20 bg-brand-card/20 px-6">
        <div className="max-w-md mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-black text-white">The Brain Score ELO</h2>
          <p className="text-xs text-gray-400">Track and project your algorithmic confidence based on problem accuracies.</p>
          
          <div className="w-36 h-36 mx-auto rounded-full border-4 border-indigo-500 border-t-transparent flex flex-col items-center justify-center animate-spin-slow">
            <span className="text-3xl font-black text-white">742</span>
            <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold">Elo index</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-normal">
            Calculated dynamically based on solve count, playground accuracy, speed, and mock recruitment reviews.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-black text-center text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="rounded-xl bg-[#090D18] border border-brand-border/60 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-white hover:bg-brand-card/40"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-10 pb-4 text-xs text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 text-center px-4 max-w-4xl mx-auto space-y-6">
        <h2 className="text-4xl font-black text-white">Ready to Master DSA?</h2>
        <p className="text-xs text-gray-400">Sign up in seconds and boost your technical interview scores immediately.</p>
        <Link
          to="/register"
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-glow inline-block"
        >
          Start Learning Free Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-brand-card/40 border-t border-brand-border/40 py-10 px-6 text-center text-xs text-gray-500 space-y-4">
        <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">Brain DSA AI</p>
        <p className="flex justify-center items-center gap-1.5">
          Designed & Developed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by Sumit Prajapati
        </p>
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/sumitprajapatismr" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/sumit-prajapati-12b707338" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </div>
        <p className="pt-2">&copy; {new Date().getFullYear()} Brain DSA AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;

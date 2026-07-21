import React, { useState } from 'react';
import axios from 'axios';
import { Target, Award, Play, AlertCircle, Heart, CheckCircle2 } from 'lucide-react';
import api from "../utils/api";
interface Scorecard {
  codingScore: number;
  logicScore: number;
  complexityScore: number;
  communicationScore: number;
  confidenceScore: number;
  feedback: string;
  suggestions: string[];
}

const InterviewLab: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [stage, setStage] = useState(0); // 0: Select, 1: Live Mock, 2: Scorecard
  const [chatLog, setChatLog] = useState<Array<{ sender: 'interviewer' | 'candidate'; text: string }>>([]);
  const [candidateInput, setCandidateInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  const companies = ['Google', 'Amazon', 'Microsoft', 'Swiggy', 'Zomato', 'Walmart'];

  const startInterview = async () => {
    setStage(1);
    setLoading(true);
    setChatLog([]);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/ai/interview', {
        currentStep: 0,
        userResponse: 'Start mock interview session',
        topic: `DSA coding focus for ${selectedCompany}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChatLog([{ sender: 'interviewer', text: res.data.response }]);
    } catch (err: any) {
      setChatLog([{ sender: 'interviewer', text: `Failed to connect with mock recruiter: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateInput.trim() || loading) return;

    const answer = candidateInput;
    setCandidateInput('');
    setChatLog(prev => [...prev, { sender: 'candidate', text: answer }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/ai/interview', {
        currentStep: chatLog.length === 1 ? 1 : 2,
        userResponse: answer,
        topic: `DSA coding focus for ${selectedCompany}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChatLog(prev => [...prev, { sender: 'interviewer', text: res.data.response }]);
      
      // If we reach stage limit, compile mock scores
      if (chatLog.length >= 3) {
        setTimeout(() => compileScorecard(), 1500);
      }
    } catch (err: any) {
      setChatLog(prev => [...prev, { sender: 'interviewer', text: `Failed to transmit answer: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const compileScorecard = () => {
    setScorecard({
      codingScore: Math.floor(Math.random() * 20) + 75,
      logicScore: Math.floor(Math.random() * 20) + 75,
      complexityScore: Math.floor(Math.random() * 25) + 70,
      communicationScore: Math.floor(Math.random() * 15) + 80,
      confidenceScore: Math.floor(Math.random() * 15) + 80,
      feedback: `Strong problem solving approach on matching vectors. Minor complexity redundancies observed in auxiliary arrays.`,
      suggestions: [
        'Review hash map lookups to optimize O(N^2) loops to O(N) linear runtime.',
        'Articulate recursion tree branches step-by-step during live boards.'
      ]
    });
    setStage(2);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Interview Simulation Lab</h1>
        <p className="mt-2 text-sm text-gray-400">Choose a target recruiter employer and practice coding questions, follow-ups, and logical evaluations live.</p>
      </div>

      {stage === 0 && (
        <div className="space-y-6">
          {/* Target Company selection */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Choose Target Recruiter</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {companies.map((comp) => {
                const isActive = selectedCompany === comp;
                return (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompany(comp)}
                    className={`p-4 rounded-xl border text-center transition-all ${isActive ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold' : 'bg-brand-dark border-brand-border text-gray-400 hover:text-white'}`}
                  >
                    <Target className="w-5 h-5 mx-auto mb-2 opacity-80" />
                    <span className="text-xs block">{comp}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={startInterview}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-glow flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4" /> Start Mock Interview
            </button>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live mock chat dialog */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow h-[450px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[360px]">
              {chatLog.map((chat, idx) => {
                const isRecruiter = chat.sender === 'interviewer';
                return (
                  <div key={idx} className={`flex ${isRecruiter ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-4 rounded-xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${isRecruiter ? 'bg-[#111A2C] border border-brand-border/40 text-gray-300' : 'bg-indigo-600 text-white shadow-glow'}`}>
                      <span className="block font-bold text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                        {isRecruiter ? 'AI Recruiter' : 'You (Candidate)'}
                      </span>
                      {chat.text}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-xl bg-brand-dark text-gray-500 animate-pulse text-xs font-mono">
                    AI Recruiter is evaluating...
                  </div>
                </div>
              )}
            </div>

            {/* Answer submission form */}
            <form onSubmit={submitAnswer} className="mt-4 flex gap-2 border-t border-brand-border/40 pt-4">
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Type your explanation or pseudocode here..."
                className="flex-1 px-4 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !candidateInput.trim()}
                className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-glow"
              >
                Send
              </button>
            </form>
          </div>

          {/* Quick status bar */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[450px]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Interview Guidelines
              </h4>
              <ul className="text-xs text-gray-400 space-y-3 leading-relaxed">
                <li>• Explain your time and space complexities for each answer.</li>
                <li>• Break down code partitions into logical dry runs.</li>
                <li>• Recruiter feedback scorecard compiles automatically after 3 interactions.</li>
              </ul>
            </div>
            <div className="p-4 bg-brand-dark border border-brand-border/40 rounded-xl text-[10px] text-gray-500">
              Target Company: <span className="font-bold text-white">{selectedCompany}</span>
            </div>
          </div>
        </div>
      )}

      {stage === 2 && scorecard && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Scorecard stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-center">
              <span className="block text-2xl font-black text-brand-teal">{scorecard.codingScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Coding Syntax</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-center">
              <span className="block text-2xl font-black text-indigo-400">{scorecard.logicScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Logic Accuracy</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-center">
              <span className="block text-2xl font-black text-purple-400">{scorecard.complexityScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Complexity</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-center">
              <span className="block text-2xl font-black text-pink-400">{scorecard.communicationScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Communication</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border text-center">
              <span className="block text-2xl font-black text-emerald-400">{scorecard.confidenceScore}%</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Confidence</span>
            </div>
          </div>

          {/* Feedback & suggestions details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> AI Recruiter Feedback
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">{scorecard.feedback}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1525] border border-brand-border shadow-glow space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Award className="w-5 h-5" /> Improvement Plan
              </h3>
              <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                {scorecard.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setStage(0)}
            className="w-full py-3 bg-[#111A2C] hover:bg-brand-border border border-brand-border rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all"
          >
            Start Another Simulation
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewLab;


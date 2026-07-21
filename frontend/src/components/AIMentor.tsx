import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Sparkles, Award } from 'lucide-react';
import api from "../utils/api";
interface ChatMessage {
  sender: 'user' | 'mentor';
  text: string;
}

const AIMentor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'mentor', text: 'Hi! I am your Brain DSA AI Mentor. Ask me to explain any algorithm, generate a topic quiz, or review your code.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/ai/ask', {
        prompt: userText,
        context: 'User is learning DSA structures. Act as a CS Professor.'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { sender: 'mentor', text: res.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'mentor', text: `Sorry, I hit an endpoint error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const generateQuickQuiz = async () => {
    setLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: 'Generate a quick quiz on Binary Trees' }]);
    
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/ai/quiz/Binary Trees', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseText = Array.isArray(res.data.quiz) 
        ? res.data.quiz.map((q: any, i: number) => `${i+1}. ${q.text}\nOptions: ${q.options.join(', ')}`).join('\n\n')
        : typeof res.data.quiz === 'string' ? res.data.quiz : 'Successfully compiled tree quiz data.';

      setMessages(prev => [...prev, { sender: 'mentor', text: responseText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { sender: 'mentor', text: `Failed to compile quiz: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow flex items-center justify-center transition-all hover:scale-110"
          title="Open AI Mentor"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Expanded Chatbot Viewport */}
      {isOpen && (
        <div className="w-80 h-96 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-3 bg-brand-dark/40 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Mentor Bot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-1.5 bg-[#111A2C] border-b border-brand-border/40 flex gap-2">
            <button
              onClick={generateQuickQuiz}
              disabled={loading}
              className="px-2.5 py-1 bg-indigo-650/40 border border-indigo-900/40 text-[10px] font-bold text-indigo-400 rounded hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-40"
            >
              Quick Quiz
            </button>
          </div>

          {/* Messages Console */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-60 text-xs">
            {messages.map((msg, idx) => {
              const isMentor = msg.sender === 'mentor';
              return (
                <div key={idx} className={`flex ${isMentor ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${isMentor ? 'bg-[#111A2C] border border-brand-border/40 text-gray-300' : 'bg-indigo-650 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-xl bg-brand-dark text-gray-500 animate-pulse font-mono">
                  AI Mentor typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-border bg-brand-dark/20 flex gap-2">
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Ask anything (E.g. Explain DFS)"
              className="flex-1 px-3 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIMentor;


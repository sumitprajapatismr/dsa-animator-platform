import React, { useState } from 'react';
import { playSoundTone } from '../utils/audio';
import { BookOpen, Sparkles, Download, ArrowRight, BookMarked, Compass } from 'lucide-react';

interface BookSection {
  title: string;
  content: string;
}

interface GeneratedBook {
  topic: string;
  type: string;
  level: string;
  language: string;
  sections: BookSection[];
}

const AINotebook: React.FC = () => {
  const [targetTopic, setTargetTopic] = useState('Arrays');
  const [bookType, setBookType] = useState('Beginner Book');
  const [explainLevel, setExplainLevel] = useState('Intermediate Mode');
  const [lang, setLang] = useState('English');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  // Interactive Features
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const handleGenerateBook = () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    playSoundTone('click');

    const interval = setInterval(() => {
      setGenerationProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);

          // Populate custom high-fidelity original content
          const mockBook: GeneratedBook = {
            topic: targetTopic,
            type: bookType,
            level: explainLevel,
            language: lang,
            sections: [
              {
                title: '1. Cover & Title Page',
                content: `# ${targetTopic} - The Complete ${bookType}\n\n**Level:** ${explainLevel}\n**Language:** ${lang}\n\n*Created by Brain DSA AI Book Generator Studio v1.0. All Rights Reserved.*`
              },
              {
                title: '2. Table of Contents',
                content: `## Table of Contents\n\n1. Cover Page\n2. Table of Contents\n3. Core Theory & Analogy\n4. Algorithm Implementations (JS, Python)\n5. Complexity Matrix\n6. Interview Questions & Summary`
              },
              {
                title: '3. Core Theory & Analogy',
                content: `## Core Theory & Real-world Analogy\n\n### What is ${targetTopic}?\n${targetTopic} represents a structured method to arrange and organize information. In software systems, this determines runtime access patterns.\n\n### The Post Office Analogy\nImagine a post office with numbered sorting boxes. Each drawer corresponds to an index, allowing immediate O(1) random retrieval once the mailbox index is known.`
              },
              {
                title: '4. Algorithm & Code',
                content: `## Implementation Code Templates\n\n### Python Implementation\n\`\`\`python\ndef solve(arr):\n    # Core logic\n    return arr\n\`\`\`\n\n### JavaScript Implementation\n\`\`\`javascript\nfunction solve(arr) {\n    // Core logic\n    return arr;\n}\n\`\`\``
              },
              {
                title: '5. Complexity Matrix',
                content: `## Complexity Profile Matrix\n\n| Case | Time Complexity | Space Complexity |\n|---|---|---|\n| Best Case | O(1) | O(1) |\n| Average Case | O(N) | O(N) |\n| Worst Case | O(N) | O(N) |`
              },
              {
                title: '6. Interview Qs & Summary',
                content: `## Key Interview Challenges\n\n1. How does memory alignment impact data retrieval?\n2. What are the space trade-offs between static allocation and dynamic chains?\n\n### Revision Cheat Sheet\n- Always verify boundary limits.\n- Cache size limits to prevent stack overflow errors.`
              }
            ]
          };

          setGeneratedBook(mockBook);
          setActiveSectionIdx(0);
          playSoundTone('success');
          return 100;
        }
        return p + 30;
      });
    }, 400);
  };

  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;
    playSoundTone('click');
    setAiResponses(prev => [
      ...prev,
      `AI Reader Coach: For "${aiQuestion}", check the complexity matrix. Generally, halving the search space recursively results in logarithmic time bounds.`
    ]);
    setAiQuestion('');
  };

  const handleBookmarkToggle = (title: string) => {
    playSoundTone('click');
    if (bookmarks.includes(title)) {
      setBookmarks(bookmarks.filter(b => b !== title));
    } else {
      setBookmarks([...bookmarks, title]);
    }
  };

  const exportBook = (format: string) => {
    if (!generatedBook) return;
    playSoundTone('success');
    const textContent = generatedBook.sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedBook.topic.toLowerCase()}_book.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Book Generator Studio</h1>
        <p className="text-xs text-gray-400 mt-1">Configure parameters to generate comprehensive, original DSA revision books and manuals dynamically.</p>
      </div>

      {!generatedBook ? (
        // ==========================================
        // CONFIGURATION AND GENERATOR WINDOW
        // ==========================================
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-brand-border/40 pb-3">
            <Sparkles className="w-5 h-5 animate-pulse" /> Book Generator Specifications
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="text-gray-500 font-bold block mb-1">Target DSA Topic</label>
              <select
                value={targetTopic}
                onChange={(e) => setTargetTopic(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-dark border border-brand-border text-white focus:outline-none"
              >
                <option>Arrays</option>
                <option>Linked List</option>
                <option>Trees</option>
                <option>Graphs</option>
                <option>Dynamic Programming</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 font-bold block mb-1">Book Type</label>
              <select
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-dark border border-brand-border text-white focus:outline-none"
              >
                <option>Beginner Book</option>
                <option>Interview Guide</option>
                <option>Revision Handbook</option>
                <option>Cheat Sheet</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 font-bold block mb-1">Explanation Mode</label>
              <select
                value={explainLevel}
                onChange={(e) => setExplainLevel(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-dark border border-brand-border text-white focus:outline-none"
              >
                <option>Simple Mode</option>
                <option>Intermediate Mode</option>
                <option>Expert Mode</option>
                <option>Kids Mode</option>
              </select>
            </div>

            <div>
              <label className="text-gray-500 font-bold block mb-1">Language Translation</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-dark border border-brand-border text-white focus:outline-none"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Hindi</option>
                <option>French</option>
              </select>
            </div>
          </div>

          {isGenerating ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Assembling book chapters...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${generationProgress}%` }} />
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerateBook}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white shadow-glow flex items-center justify-center gap-1.5"
            >
              Generate Complete Book <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        // ==========================================
        // GENERATED BOOK READER VIEWER WORKSPACE
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[520px]">
          {/* Chapter Navigation List */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Table of Contents
              </h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {generatedBook.sections.map((sect, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setActiveSectionIdx(idx); playSoundTone('click'); }}
                    className={`p-2.5 rounded-lg border text-left text-[11px] cursor-pointer transition-all ${idx === activeSectionIdx ? 'bg-indigo-650/10 border-indigo-500 text-white font-bold' : 'bg-brand-dark/40 border-brand-border/40 text-gray-400 hover:border-brand-border hover:text-white'}`}
                  >
                    {sect.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Export options */}
            <div className="space-y-2 border-t border-brand-border/30 pt-3">
              <span className="text-[10px] text-gray-500 block mb-1">Export Book:</span>
              <div className="flex gap-2">
                <button onClick={() => exportBook('md')} className="flex-1 py-1.5 bg-[#111A2C] border border-brand-border rounded text-[9px] font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1">
                  <Download className="w-3 h-3" /> MD
                </button>
                <button onClick={() => exportBook('html')} className="flex-1 py-1.5 bg-[#111A2C] border border-brand-border rounded text-[9px] font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1">
                  <Download className="w-3 h-3" /> HTML
                </button>
              </div>
            </div>
          </div>

          {/* Book Content view */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between h-full overflow-y-auto">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3 mb-4">
              <span className="text-xs font-bold text-indigo-400">Reading Mode: {explainLevel}</span>
              <button
                onClick={() => handleBookmarkToggle(generatedBook.sections[activeSectionIdx].title)}
                className={`p-1.5 rounded border ${bookmarks.includes(generatedBook.sections[activeSectionIdx].title) ? 'bg-indigo-650/10 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border/40 text-gray-400 hover:text-white'}`}
              >
                <BookMarked className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-xs text-gray-300 leading-relaxed font-sans prose prose-invert overflow-y-auto pr-2 max-h-[360px]">
              <pre className="whitespace-pre-wrap font-sans text-xs">{generatedBook.sections[activeSectionIdx].content}</pre>
            </div>

            <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono mt-3">
              <span>Read time: ~12 min</span>
              <button onClick={() => { setGeneratedBook(null); playSoundTone('click'); }} className="text-indigo-400 hover:underline">
                Generate another book
              </button>
            </div>
          </div>

          {/* Interactive AI chatbot sidebar & Personal Notes */}
          <div className="p-4 rounded-2xl bg-[#0D1525] border border-brand-border flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> AI Reader Assistant
              </h3>
              <div className="max-h-[140px] overflow-y-auto space-y-2 text-[10px] text-gray-400 pr-1">
                {aiResponses.map((res, i) => (
                  <div key={i} className="p-2 rounded bg-brand-dark/60 border border-brand-border/30">
                    {res}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Ask AI Reader..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-[#111A2C] border border-brand-border rounded text-[10px] text-white focus:outline-none"
                />
                <button onClick={handleAskAI} className="px-2.5 py-1.5 bg-indigo-650 text-white rounded text-[10px] font-bold">
                  Ask
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-brand-border/30 pt-3">
              <label className="text-[10px] text-gray-500 font-bold block mb-1">Personal Chapter Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your study notes for this section..."
                className="w-full h-24 p-2 bg-brand-dark border border-brand-border/40 rounded text-[10px] text-gray-300 placeholder-gray-600 focus:outline-none font-mono resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AINotebook;

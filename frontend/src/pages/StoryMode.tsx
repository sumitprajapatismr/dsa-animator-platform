import React, { useState } from 'react';
import { playSoundTone } from '../utils/audio';
import { Volume2, VolumeX, ArrowRight, ArrowLeft, Trophy, Sparkles, User, RefreshCw, Compass } from 'lucide-react';

interface ChapterSpec {
  title: string;
  description: string;
  narratorSays: string;
  illustration: React.ReactNode;
  choice?: {
    prompt: string;
    options: string[];
    correctIdx: number;
    feedback: string[];
  };
}

interface AdventureStory {
  title: string;
  world: string;
  character: string;
  characterTitle: string;
  analogy: string;
  chapters: ChapterSpec[];
}

const ADVENTURE_STORIES: AdventureStory[] = [
  {
    title: 'The Lost Treasure of Binary Search',
    world: 'Searching City',
    character: 'Smart Detective',
    characterTitle: 'Detective Smart',
    analogy: 'Finding an item in a sorted directory by halving search limits.',
    chapters: [
      {
        title: 'Chapter 1: The Sorting Cave',
        description: 'You stand before a cave with tunnels sorted by depth index.',
        narratorSays: 'Welcome, explorer! The treasure lies at depth 37. The tunnels are sorted in increasing order from 1 to 100. Choose your strategy.',
        illustration: (
          <svg className="w-full h-36 overflow-visible flex items-center justify-center">
            <rect x="20" y="30" width="80" height="60" rx="6" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
            <text x="60" y="65" fill="#6366F1" fontSize="12" fontWeight="bold" textAnchor="middle">Sorted Caves</text>
            <circle cx="200" cy="60" r="15" fill="#EC4899" className="animate-pulse" />
            <text x="200" y="90" fill="white" fontSize="10" textAnchor="middle">Depth 37</text>
          </svg>
        )
      },
      {
        title: 'Chapter 2: The Middle Choice',
        description: 'You must make your first decision to find the depth 37 treasure.',
        narratorSays: 'We stand between index 1 and 100. Which tunnel index should we inspect first to minimize steps?',
        illustration: (
          <svg className="w-full h-36 overflow-visible">
            <rect x="20" y="40" width="40" height="40" rx="4" fill="#334155" />
            <text x="40" y="65" fill="white" fontSize="10" textAnchor="middle">L: 1</text>
            <rect x="100" y="40" width="40" height="40" rx="4" fill="#6366F1" />
            <text x="120" y="65" fill="white" fontSize="10" textAnchor="middle">Mid: 50</text>
            <rect x="180" y="40" width="40" height="40" rx="4" fill="#334155" />
            <text x="200" y="65" fill="white" fontSize="10" textAnchor="middle">H: 100</text>
          </svg>
        ),
        choice: {
          prompt: 'Which tunnel index do you choose?',
          options: ['Index 1 (Low)', 'Index 50 (Middle)', 'Index 100 (High)'],
          correctIdx: 1,
          feedback: [
            'No, inspecting the edges gives O(N) linear time in the worst case.',
            'Correct! By checking the middle value (50), we can halve the search bounds in a single step.',
            'No, checking the high boundary limits our halving capabilities.'
          ]
        }
      },
      {
        title: 'Chapter 3: Halving the Realm',
        description: 'Index 50 had a depth of 50. Since 50 > 37, the right half is discarded.',
        narratorSays: 'Excellent! The right half of the cave is sealed off. We narrow our search space to range [1, 49].',
        illustration: (
          <svg className="w-full h-36 overflow-visible">
            <rect x="20" y="40" width="80" height="40" rx="4" fill="#059669" />
            <text x="60" y="65" fill="white" fontSize="10" textAnchor="middle">Active: [1, 49]</text>
            <rect x="160" y="40" width="80" height="40" rx="4" fill="#EF4444" opacity="0.3" />
            <text x="200" y="65" fill="white" fontSize="10" textAnchor="middle" opacity="0.4">Sealed: [50, 100]</text>
          </svg>
        )
      }
    ]
  },
  {
    title: 'The Sorting Duel of Bubble Wizard',
    world: 'Sorting Kingdom',
    character: 'Bubble Wizard',
    characterTitle: 'Wizard Bubble',
    analogy: 'Sorting adjacent elements repeatedly until the tallest bubbles to the end.',
    chapters: [
      {
        title: 'Chapter 1: The Tallest Giant',
        description: 'A row of magic columns are unsorted. The Bubble Wizard casts a swap spell.',
        narratorSays: 'Welcome to the Sorting Kingdom! To sort this row, I compare adjacent heights and swap them if they are out of order.',
        illustration: (
          <svg className="w-full h-36 overflow-visible flex items-end justify-center pb-4">
            <rect x="30" y="40" width="25" height="80" rx="4" fill="#6366F1" />
            <rect x="70" y="60" width="25" height="60" rx="4" fill="#EC4899" />
            <rect x="110" y="20" width="25" height="100" rx="4" fill="#10B981" />
          </svg>
        )
      }
    ]
  }
];

const StoryMode: React.FC = () => {
  const [selectedStoryIdx, setSelectedStoryIdx] = useState<number | null>(null);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [speechActive, setSpeechActive] = useState(false);
  const [choiceMade, setChoiceMade] = useState<number | null>(null);

  // Custom AI Story generator states
  const [customAlgo, setCustomAlgo] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<AdventureStory | null>(null);

  const activeStory = selectedStoryIdx !== null ? ADVENTURE_STORIES[selectedStoryIdx] : generatedStory;
  const activeChapter = activeStory?.chapters[chapterIdx] || null;

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speechActive) {
        window.speechSynthesis.cancel();
        setSpeechActive(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setSpeechActive(false);
        window.speechSynthesis.speak(utterance);
        setSpeechActive(true);
      }
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const handleCustomStorySubmit = () => {
    if (!customAlgo.trim()) return;
    setIsGeneratingStory(true);
    playSoundTone('click');

    setTimeout(() => {
      // Create custom generated story
      const custom: AdventureStory = {
        title: `The Quest of ${customAlgo}`,
        world: 'AI Laboratory Dimension',
        character: 'AI Coach Bot',
        characterTitle: 'Mentor Bot',
        analogy: 'Custom simulated concept pathway traversal.',
        chapters: [
          {
            title: 'Chapter 1: The Initial State',
            description: `We begin exploring the operational structure of ${customAlgo}.`,
            narratorSays: `Greetings! We have entered the custom simulation of ${customAlgo}. Let us inspect its base properties.`,
            illustration: (
              <svg className="w-full h-36 overflow-visible flex items-center justify-center">
                <rect x="50" y="30" width="120" height="60" rx="6" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
                <text x="110" y="65" fill="#6366F1" fontSize="12" fontWeight="bold" textAnchor="middle">{customAlgo}</text>
              </svg>
            )
          }
        ]
      };
      setGeneratedStory(custom);
      setSelectedStoryIdx(null); // use generated
      setChapterIdx(0);
      setChoiceMade(null);
      setIsGeneratingStory(false);
      playSoundTone('success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Algorithm Story Mode</h1>
          <p className="text-xs text-gray-400 mt-1">Interact with visual algorithm narratives, character duels, and checkpoint choice cards.</p>
        </div>

        {/* Custom AI Story Generator Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type any algorithm (e.g. DFS)"
            value={customAlgo}
            onChange={(e) => setCustomAlgo(e.target.value)}
            className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleCustomStorySubmit}
            disabled={isGeneratingStory}
            className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white flex items-center gap-1.5"
          >
            {isGeneratingStory ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Custom Adventure
          </button>
        </div>
      </div>

      {activeStory === null ? (
        // ==========================================
        // SELECT STORY LIST VIEW
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ADVENTURE_STORIES.map((story, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedStoryIdx(idx);
                setGeneratedStory(null);
                setChapterIdx(0);
                setChoiceMade(null);
                playSoundTone('click');
              }}
              className="p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-indigo-500/50 hover:shadow-glow cursor-pointer transition-all flex flex-col justify-between h-44"
            >
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">{story.world}</span>
                <h3 className="text-lg font-bold text-white">{story.title}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-500" /> Lead: {story.character}
                </p>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                Enter Adventure <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      ) : (
        // ==========================================
        // ACTIVE ADVENTURE STORY VIEW
        // ==========================================
        <div className="space-y-6">
          {/* Header controls */}
          <div className="p-4 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between">
            <button
              onClick={() => { setSelectedStoryIdx(null); setGeneratedStory(null); playSoundTone('click'); }}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Story Mode
            </button>
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{activeStory?.title}</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Narrative Frame */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between min-h-[440px]">
              
              {/* Illustration and Animations */}
              <div className="flex-1 flex items-center justify-center p-4 bg-brand-dark/30 rounded-xl border border-brand-border/40 min-h-48 relative overflow-hidden">
                {activeChapter?.illustration}
              </div>

              {/* Text Description and Speech Narrator */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleSpeech(activeChapter?.narratorSays || '')}
                    className={`p-3 rounded-full border transition-all shrink-0 ${speechActive ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#111A2C] border-brand-border text-gray-400 hover:text-white'}`}
                  >
                    {speechActive ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] uppercase font-bold text-indigo-400">{activeStory?.characterTitle} Says:</span>
                    <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                      "{activeChapter?.narratorSays}"
                    </p>
                  </div>
                </div>

                {/* Narrative timeline navigation */}
                <div className="flex justify-between items-center border-t border-brand-border/40 pt-4 text-xs font-mono">
                  <button
                    onClick={() => { setChapterIdx(prev => Math.max(0, prev - 1)); setChoiceMade(null); playSoundTone('click'); }}
                    disabled={chapterIdx === 0}
                    className="px-3 py-1.5 bg-[#111A2C] border border-brand-border rounded text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    Previous Chapter
                  </button>
                  <span className="text-gray-500">Chapter {chapterIdx + 1}/{activeStory?.chapters.length}</span>
                  <button
                    onClick={() => { setChapterIdx(prev => Math.min(activeStory.chapters.length - 1, prev + 1)); setChoiceMade(null); playSoundTone('click'); }}
                    disabled={chapterIdx === activeStory.chapters.length - 1}
                    className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded disabled:opacity-30"
                  >
                    Next Chapter
                  </button>
                </div>
              </div>
            </div>

            {/* Right Choice/Spec Frame */}
            <div className="p-6 rounded-2xl bg-[#0D1525] border border-brand-border shadow-glow flex flex-col justify-between min-h-[440px]">
              {activeChapter?.choice ? (
                // Interactive Choice Node
                (() => {
                  const choiceObj = activeChapter.choice;
                  return (
                    <div>
                      <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-5 h-5 text-indigo-400 animate-spin" /> Interactive Decision Point
                      </h4>
                      <p className="text-xs text-gray-300 font-semibold mb-4 leading-relaxed">
                        {choiceObj.prompt}
                      </p>
                      <div className="space-y-2">
                        {choiceObj.options.map((opt, oIdx) => {
                          let btnStyle = 'bg-brand-dark border-brand-border text-gray-400 hover:text-white';
                          if (choiceMade !== null) {
                            if (oIdx === choiceObj.correctIdx) {
                              btnStyle = 'bg-emerald-950/20 border-emerald-900/60 text-emerald-400';
                            } else if (choiceMade === oIdx) {
                              btnStyle = 'bg-red-950/20 border-red-900/60 text-red-400';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => { setChoiceMade(oIdx); playSoundTone(oIdx === choiceObj.correctIdx ? 'success' : 'click'); }}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {choiceMade !== null && (
                        <div className="mt-4 p-3.5 bg-brand-dark border border-brand-border/40 rounded-xl text-[10px] text-gray-400 leading-relaxed">
                          {choiceObj.feedback[choiceMade]}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                // Static Explanation details card
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-indigo-400" /> Story Information
                  </h4>
                  <div className="space-y-3 leading-relaxed text-xs text-gray-300">
                    <p>{activeChapter?.description}</p>
                    <div className="border-t border-brand-border/30 pt-3">
                      <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Real-world analogy:</span>
                      <p className="text-gray-400 leading-relaxed">{activeStory.analogy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Revision note card at bottom */}
              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 text-indigo-400 rounded-lg text-[10px] font-bold text-center">
                Complexity Profile: O(log N) Time bounds.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryMode;

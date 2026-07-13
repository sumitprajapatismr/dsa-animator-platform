import React, { useState } from 'react';
import { playSoundTone } from '../utils/audio';
import { Trophy, Award, Calendar, Play, Activity } from 'lucide-react';

interface Milestone {
  id: string;
  date: string;
  title: string;
  category: 'Coding' | 'System' | 'Placement' | 'Whiteboard' | 'Certificates';
  desc: string;
  aiFeedback: string;
  skills: string[];
  xpGained: number;
}

const AIAchievementTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const milestones: Milestone[] = [
    {
      id: '1',
      date: '2026-07-01',
      title: 'First Coding Race Win',
      category: 'Coding',
      desc: 'Defeated the Beginner AI Coder in a 100m Sorting Sprint (Bubble vs Quicksort).',
      aiFeedback: 'AI Coach: Excellent speed metrics. Partition index selection was highly optimal.',
      skills: ['Sorting Algorithms', 'Algorithmic Speed optimization'],
      xpGained: 250
    },
    {
      id: '2',
      date: '2026-07-04',
      title: 'Whiteboard Sandbox Session',
      category: 'Whiteboard',
      desc: 'Sketched a complete AVL balance tree rotation diagram using element stamps.',
      aiFeedback: 'AI Coach: Left-Right double rotation handles recursive depth perfectly.',
      skills: ['AVL Trees', 'Self-balancing trees traversal'],
      xpGained: 150
    },
    {
      id: '3',
      date: '2026-07-08',
      title: 'Operating Systems Course',
      category: 'System',
      desc: 'Completed all FCFS scheduling Gantt chart simulations and passed OS MCQs.',
      aiFeedback: 'AI Coach: Gantt chart calculations correctly accounted for process wait times.',
      skills: ['CPU Scheduling', 'Context switching bounds'],
      xpGained: 300
    },
    {
      id: '4',
      date: '2026-07-10',
      title: 'ATS Resume Rating: 82%',
      category: 'Placement',
      desc: 'Analyzed SDE intern profile and successfully integrated Docker & Redis keywords.',
      aiFeedback: 'AI Coach: Keyword density increased matching criteria requirements for Google L3 SDE roles.',
      skills: ['ATS optimization', 'Resume profile building'],
      xpGained: 200
    },
    {
      id: '5',
      date: '2026-07-12',
      title: 'Trie Search Book Compilation',
      category: 'Certificates',
      desc: 'Generated a comprehensive original 6-chapter manual on Trie search engines.',
      aiFeedback: 'AI Coach: Great addition of real-world IP prefix lookup analogy pages.',
      skills: ['Trie Trees', 'Lexicographical search engines'],
      xpGained: 400
    }
  ];

  const handleMilestoneClick = (ms: Milestone) => {
    setSelectedMilestone(ms);
    playSoundTone('success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Journey Timeline</h1>
        <p className="text-xs text-gray-400 mt-1">Interactive chronicle of your learning accomplishments, XP updates, and interview achievements inside Brain DSA AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive Timeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 animate-pulse" /> Achievements Chronicle
          </h3>

          <div className="relative border-l-2 border-brand-border pl-6 ml-4 space-y-6">
            {milestones.map((ms) => (
              <div
                key={ms.id}
                onClick={() => handleMilestoneClick(ms)}
                className="relative group cursor-pointer"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-brand-dark border-2 border-indigo-500 group-hover:bg-indigo-500 transition-all" />

                {/* Milestone details card */}
                <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/60 group-hover:border-indigo-500/50 transition-all space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ms.date}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900/40 font-mono font-bold">+{ms.xpGained} XP</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-all">{ms.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Milestone Details & Replay */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between min-h-[380px]">
          {selectedMilestone ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Milestone Insignia
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                <h4 className="font-extrabold text-white text-sm">{selectedMilestone.title}</h4>
                
                <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-[10px] font-mono text-indigo-400">
                  {selectedMilestone.aiFeedback}
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Skills Developed:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMilestone.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-brand-dark border border-brand-border/60 text-[9px] text-gray-400 font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
              <Award className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">Click any milestone on the timeline to replay details and view coach feedback.</p>
            </div>
          )}

          {selectedMilestone && (
            <button
              onClick={() => { playSoundTone('success'); alert(`Replaying milestone: ${selectedMilestone.title}`); }}
              className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 rounded text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-glow mt-4"
            >
              <Play className="w-3.5 h-3.5" /> Replay Milestone Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAchievementTimeline;

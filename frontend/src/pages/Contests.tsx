import React, { useState } from 'react';
import { Award, Calendar, Play, Trophy, Users } from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  participants: number;
  duration: string;
  date: string;
  status: 'Live' | 'Upcoming' | 'Completed';
}

const Contests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'leaderboard'>('tournaments');
  const [contests] = useState<Contest[]>([
    { id: '1', title: 'Daily Speed Run #45', type: 'Daily', participants: 142, duration: '45 mins', date: 'Live Now', status: 'Live' },
    { id: '2', title: 'Weekly Algo Tournament #12', type: 'Weekly', participants: 620, duration: '2 hours', date: '2026-07-18 18:00', status: 'Upcoming' },
    { id: '3', title: 'Monthly Grandmaster Cup', type: 'Monthly', participants: 1840, duration: '3 hours', date: '2026-07-25 10:00', status: 'Upcoming' }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Alice Smith', rating: 2840, solved: 5, time: '14m 20s' },
    { rank: 2, name: 'Bob Jones', rating: 2650, solved: 5, time: '18m 45s' },
    { rank: 3, name: 'Charlie Brown', rating: 2410, solved: 4, time: '22m 10s' },
    { rank: 4, name: 'David Miller', rating: 2320, solved: 4, time: '27m 50s' }
  ]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Live Coding Contests</h1>
        <p className="mt-2 text-sm text-gray-400">Join daily speed runs and weekly algorithms tournaments. Improve your ELO placement ratings.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border">
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'tournaments' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Tournaments
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'leaderboard' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Contest Standing
        </button>
      </div>

      {activeTab === 'tournaments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of contests */}
          <div className="lg:col-span-2 space-y-4">
            {contests.map((cont) => {
              const isLive = cont.status === 'Live';
              return (
                <div key={cont.id} className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${isLive ? 'bg-red-950/20 border-red-900/60 text-red-400 animate-pulse' : 'bg-indigo-950/20 border-indigo-900/60 text-indigo-400'}`}>
                        {cont.status}
                      </span>
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{cont.type}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{cont.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {cont.date} | Duration: {cont.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cont.participants} joined
                    </span>
                    <button
                      onClick={() => alert(`Launching Workspace environment for ${cont.title}...`)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white shadow-glow"
                    >
                      {isLive ? 'Enter Arena' : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rating stats */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[300px]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
                <Trophy className="w-5 h-5" /> Your Rating Profile
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded bg-brand-dark/40 border border-brand-border/40">
                  <span className="text-gray-500 uppercase font-bold">ELO Rating</span>
                  <span className="font-bold text-white">1540 (Expert)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-brand-dark/40 border border-brand-border/40">
                  <span className="text-gray-500 uppercase font-bold">Rank Percent</span>
                  <span className="font-bold text-brand-teal">Top 12%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/20 border border-indigo-900/60 rounded-xl text-[10px] text-gray-400">
              *Participating in weekly tournaments updates your global ranking index dynamically.*
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow overflow-x-auto">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
            <Award className="w-5 h-5" /> Global Tournament Standings
          </h3>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border/40 text-gray-500 uppercase tracking-wider font-bold">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Candidate</th>
                <th className="pb-3">ELO Rating</th>
                <th className="pb-3">Solved Issues</th>
                <th className="pb-3 text-right">Completion Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30 text-gray-300">
              {leaderboard.map((item) => (
                <tr key={item.rank} className="hover:bg-brand-dark/20 transition-colors">
                  <td className="py-3.5 font-bold">#{item.rank}</td>
                  <td className="py-3.5 font-semibold text-white">{item.name}</td>
                  <td className="py-3.5">{item.rating}</td>
                  <td className="py-3.5 text-brand-teal font-black">{item.solved} / 5</td>
                  <td className="py-3.5 text-right font-mono">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contests;


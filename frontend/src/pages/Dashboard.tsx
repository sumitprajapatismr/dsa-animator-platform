import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { updateUserStats } from '../features/authSlice';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Award, Zap, ShieldAlert, Sparkles, BookOpenCheck, Flame, Trophy } from 'lucide-react';

interface DashboardPayload {
  stats: {
    xp: number;
    level: number;
    coins: number;
    streak: { current: number; max: number };
    badges: Array<{ badgeId: string; name: string; icon: string }>;
  };
  topicStats: Array<{
    id: string;
    name: string;
    percentage: number;
    solvedProblemsCount: number;
  }>;
  heatmap: Array<{ date: string; count: number }>;
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        // Sync Redux profile stats
        dispatch(updateUserStats({
          xp: res.data.stats.xp,
          coins: res.data.stats.coins,
          level: res.data.stats.level,
          badges: res.data.stats.badges
        }));

        const resLeaderboard = await axios.get('/api/progress/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaderboard(resLeaderboard.data.leaderboard);
      } catch (err) {
        console.error('Error fetching dashboard content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [dispatch]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading your profile dashboard...</p>
      </div>
    );
  }

  // Sample Recharts data computed from XP
  const xpChartData = [
    { name: 'Mon', xp: Math.max(0, data.stats.xp - 140) },
    { name: 'Tue', xp: Math.max(0, data.stats.xp - 110) },
    { name: 'Wed', xp: Math.max(0, data.stats.xp - 80) },
    { name: 'Thu', xp: Math.max(0, data.stats.xp - 60) },
    { name: 'Fri', xp: Math.max(0, data.stats.xp - 40) },
    { name: 'Sat', xp: Math.max(0, data.stats.xp - 20) },
    { name: 'Sun', xp: data.stats.xp }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative p-6 overflow-hidden rounded-2xl glass-panel border border-brand-border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name}</span>!
            </h1>
            <p className="mt-2 text-sm text-gray-400">You are level {data.stats.level}. Push yourself and earn +50 XP by solving a coding problem today.</p>
          </div>
          <div className="flex items-center gap-4 bg-brand-card/60 p-4 rounded-xl border border-brand-border/60">
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-indigo-400">{data.stats.xp}</span>
              <span className="text-[10px] uppercase font-bold text-gray-500">XP Points</span>
            </div>
            <div className="w-px h-10 bg-brand-border" />
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-brand-teal">🪙 {data.stats.coins}</span>
              <span className="text-[10px] uppercase font-bold text-gray-500">Coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak card */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Daily Coding Streak</span>
            <h3 className="text-3xl font-black text-orange-500 mt-1">{data.stats.streak.current} Days</h3>
            <p className="text-xs text-gray-400 mt-2">Personal best: {data.stats.streak.max} days</p>
          </div>
          <div className="p-4 bg-orange-950/20 border border-orange-900/60 rounded-2xl">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500/20" />
          </div>
        </div>

        {/* Level card */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Current Rank</span>
            <h3 className="text-3xl font-black text-indigo-400 mt-1">Level {data.stats.level}</h3>
            <p className="text-xs text-gray-400 mt-2">Next level at {Math.pow(data.stats.level, 2) * 100} XP</p>
          </div>
          <div className="p-4 bg-indigo-950/20 border border-indigo-900/60 rounded-2xl">
            <Trophy className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
          </div>
        </div>

        {/* Problems solved card */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Problems Mastered</span>
            <h3 className="text-3xl font-black text-brand-teal mt-1">
              {data.topicStats.reduce((acc, curr) => acc + curr.solvedProblemsCount, 0)} Solved
            </h3>
            <p className="text-xs text-gray-400 mt-2">Earn certificates on topic completion</p>
          </div>
          <div className="p-4 bg-teal-950/20 border border-teal-900/60 rounded-2xl">
            <BookOpenCheck className="w-8 h-8 text-brand-teal" />
          </div>
        </div>
      </div>

      {/* Grid of Main Analytics & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts progress chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
          <h3 className="text-lg font-bold mb-4">Weekly XP Velocity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpChartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4B5563" fontSize={12} />
                <YAxis stroke="#4B5563" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#161F30', borderColor: '#23324C', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="xp" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
          <h3 className="text-lg font-bold mb-4">Achievements Unlocked</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {data.stats.badges.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Award className="w-12 h-12 text-gray-700 mb-2" />
                <p className="text-xs text-gray-500">No achievements unlocked yet. Go solve problems to unlock them!</p>
              </div>
            ) : (
              data.stats.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#111A2C] border border-brand-border/40">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{badge.name}</h4>
                    <p className="text-[10px] text-gray-400">Awarded for active coding milestones</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Daily Challenge & AI suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Challenge */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/40">Daily Challenge</span>
            <h3 className="text-lg font-bold text-white mt-3">Two Sum Substrings</h3>
            <p className="text-xs text-gray-400 mt-2">Evaluate hash table lookups in matching numeric lists. Earn double XP + 10 bonus coins today.</p>
          </div>
          <Link
            to="/problems/two-sum"
            className="mt-4 w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-glow transition-all block"
          >
            Solve Challenge
          </Link>
        </div>

        {/* AI Recommendations */}
        <div className="p-6 rounded-2xl bg-[#0D1525] border border-brand-border shadow-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Assistant Suggestions</span>
            </div>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              "Based on your recent progress in arrays, we suggest moving to **Quick Sort visualizers** or testing **Binary Search** bounds in the playground to reinforce O(log N) partitioning concepts."
            </p>
          </div>
          <Link
            to="/visualizer"
            className="mt-4 w-full py-2.5 text-center bg-[#111A2C] hover:bg-brand-border border border-brand-border rounded-xl text-xs font-bold text-indigo-400 hover:text-white transition-all block"
          >
            Review AI Roadmap
          </Link>
        </div>
      </div>

      {/* GitHub-style Heatmap Calendar */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
        <h3 className="text-lg font-bold mb-4">Daily Activity Grid</h3>
        <div className="flex flex-wrap gap-1 items-center justify-start overflow-x-auto pb-2">
          {/* We generate a basic visual representation of heatmap cells */}
          {Array.from({ length: 90 }).map((_, idx) => {
            const dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - (90 - idx));
            const dayStr = dateObj.toISOString().split('T')[0];
            const activeDay = data.heatmap.find(h => h.date === dayStr);
            const count = activeDay ? activeDay.count : 0;

            let bgColor = 'bg-gray-800/40 border border-gray-800/50';
            if (count === 1) bgColor = 'bg-indigo-950 border border-indigo-900/60';
            else if (count === 2) bgColor = 'bg-indigo-800/80';
            else if (count >= 3) bgColor = 'bg-indigo-500 shadow-glow';

            return (
              <div
                key={idx}
                title={`${dayStr}: ${count} actions`}
                className={`w-4 h-4 rounded-sm transition-transform hover:scale-125 ${bgColor}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-end">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-800/40" />
          <div className="w-3 h-3 rounded-sm bg-indigo-950" />
          <div className="w-3 h-3 rounded-sm bg-indigo-800/80" />
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span>More</span>
        </div>
      </div>

      {/* Topic percentages completion */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
        <h3 className="text-lg font-bold mb-4">Topic Completion Indexes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.topicStats.map((topic, index) => (
            <div key={index} className="p-4 rounded-xl bg-[#111A2C] border border-brand-border/40">
              <div className="flex justify-between text-sm font-semibold">
                <span>{topic.name}</span>
                <span className="text-indigo-400">{topic.percentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
                <span>{topic.solvedProblemsCount} coding challenges solved</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Standings */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-400" />
          Global Leaderboard Standings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border/40 text-gray-500 uppercase tracking-wider font-bold">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Level Rank</th>
                <th className="pb-3 text-right">XP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30 text-gray-300">
              {leaderboard.map((item, index) => (
                <tr key={item._id} className="hover:bg-brand-dark/20 transition-colors">
                  <td className="py-3.5 font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="py-3.5 font-semibold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] uppercase font-bold text-indigo-400">
                      {item.name.charAt(0)}
                    </div>
                    {item.name}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded bg-brand-dark text-cyan-400 border border-brand-border/50 text-[10px]">
                      Level {item.level}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-black text-brand-teal">{item.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

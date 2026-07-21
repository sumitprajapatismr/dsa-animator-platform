import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Users, FolderOpen, Send, Trash2, Plus, Sparkles } from 'lucide-react';
import api from "../utils/api";
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
}

interface Analytics {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  successRate: number;
  breakdown: { easy: number; medium: number; hard: number };
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'add_problem'>('metrics');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Problem form state
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [tags, setTags] = useState('arrays');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const resAnalytic = await api.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
      setAnalytics(resAnalytic.data.stats);

      const resUsers = await api.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(resUsers.data.users);
    } catch (err) {
      console.error('Failed to fetch admin dashboard metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRole = async (userId: string, role: string) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Saving problem to database...');
    const token = localStorage.getItem('token');

    try {
      await api.post('/api/admin/problems', {
        title,
        difficulty,
        description,
        timeComplexity,
        spaceComplexity,
        tags: tags.split(',').map((t) => t.trim()),
        codeTemplates: [
          { language: 'javascript', template: `function ${title.toLowerCase().replace(/[^a-z0-9]+/g, '')}(params) {\n  // Write code\n}` }
        ],
        testCases: [
          { input: 'custom_input', expectedOutput: 'custom_output' }
        ]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatusMsg('Problem uploaded and seeded successfully!');
      setTitle('');
      setDescription('');
      fetchAdminData();
    } catch (err: any) {
      setStatusMsg(`Upload failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading system metrics dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations Panel</h1>
          <p className="mt-1 text-sm text-gray-400">Manage user authorization roles, audit system activity, and seed coding problems.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-3">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'metrics' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          System Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          User Registry ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('add_problem')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'add_problem' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Upload Problem
        </button>
      </div>

      {/* Content panes */}
      <div className="mt-6">
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Registrants</span>
                <h3 className="text-3xl font-black mt-2 text-indigo-400">{analytics.totalUsers}</h3>
              </div>
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Problem Count</span>
                <h3 className="text-3xl font-black mt-2 text-cyan-400">{analytics.totalProblems}</h3>
              </div>
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Submissions Evaluated</span>
                <h3 className="text-3xl font-black mt-2 text-brand-purple">{analytics.totalSubmissions}</h3>
              </div>
              <div className="p-6 bg-brand-card border border-brand-border rounded-2xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sandbox Success Rate</span>
                <h3 className="text-3xl font-black mt-2 text-emerald-400">{analytics.successRate}%</h3>
              </div>
            </div>

            {/* Breakdown chart panel */}
            <div className="p-6 bg-brand-card border border-brand-border rounded-2xl">
              <h3 className="text-lg font-bold mb-4">Problem Difficulty Distribution</h3>
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Easy Challenges</span>
                      <span className="text-green-400">{analytics.breakdown.easy}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2" style={{ width: `${(analytics.breakdown.easy / analytics.totalProblems) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Medium Challenges</span>
                      <span className="text-yellow-400">{analytics.breakdown.medium}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-2" style={{ width: `${(analytics.breakdown.medium / analytics.totalProblems) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Hard Challenges</span>
                      <span className="text-red-400">{analytics.breakdown.hard}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-2" style={{ width: `${(analytics.breakdown.hard / analytics.totalProblems) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6 bg-brand-card border border-brand-border rounded-2xl overflow-x-auto shadow-glow">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border/40 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="pb-3">User Details</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">XP Points</th>
                  <th className="pb-3">Role Authorization</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30 text-gray-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-brand-dark/20">
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 font-mono">{u.email}</td>
                    <td className="py-3 font-semibold text-brand-teal">{u.xp} XP</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        className="bg-brand-dark border border-brand-border text-xs rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Student">Student</option>
                        <option value="Premium Student">Premium Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1 rounded hover:bg-red-950/20 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add_problem' && (
          <form onSubmit={handleCreateProblem} className="p-6 bg-brand-card border border-brand-border rounded-2xl space-y-4 max-w-2xl shadow-glow">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-indigo-400" />
              Upload Coding Challenge
            </h3>

            {statusMsg && (
              <div className="p-3 text-xs font-semibold text-indigo-400 border rounded-lg bg-indigo-950/20 border-indigo-900/60">
                {statusMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="Reverse a Linked List"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Difficulty Rating</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Problem Description (Markdown supported)</label>
              <textarea
                required
                rows={4}
                placeholder="Describe the objective, input parameters, and examples..."
                className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Time Complexity</label>
                <input
                  type="text"
                  placeholder="O(N)"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Space Complexity</label>
                <input
                  type="text"
                  placeholder="O(1)"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="linkedlist, two-pointer"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition-all shadow-glow text-white"
            >
              Upload Problem to Seed List
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


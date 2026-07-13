import React, { useState } from 'react';
import { Briefcase, Calendar, CheckSquare, Plus, Trash } from 'lucide-react';

interface JobApplication {
  id: string;
  company: string;
  role: string;
  stage: 'Applied' | 'Screen' | 'Onsite' | 'Offer' | 'Rejected';
  date: string;
}

const PlacementDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([
    { id: '1', company: 'Google', role: 'SWE Intern', stage: 'Onsite', date: '2026-07-20' },
    { id: '2', company: 'Meta', role: 'SWE Intern', stage: 'Applied', date: '2026-07-15' },
    { id: '3', company: 'Microsoft', role: 'SWE New Grad', stage: 'Offer', date: '2026-07-10' }
  ]);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stageVal, setStageVal] = useState<'Applied' | 'Screen' | 'Onsite' | 'Offer' | 'Rejected'>('Applied');

  const addApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: JobApplication = {
      id: Date.now().toString(),
      company,
      role,
      stage: stageVal,
      date: new Date().toISOString().split('T')[0]
    };

    setApplications([...applications, newApp]);
    setCompany('');
    setRole('');
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  const getStageList = (targetStage: 'Applied' | 'Screen' | 'Onsite' | 'Offer' | 'Rejected') => {
    return applications.filter(app => app.stage === targetStage);
  };

  const stages: Array<'Applied' | 'Screen' | 'Onsite' | 'Offer' | 'Rejected'> = [
    'Applied', 'Screen', 'Onsite', 'Offer', 'Rejected'
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Placement Career Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">Manage and track your recruitment stages, interview schedules, and offers. Keep target job applications organized.</p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Applied</span>
          <span className="text-2xl font-black text-white mt-1 block">{applications.length} Companies</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Active Stages</span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">
            {applications.filter(a => a.stage === 'Screen' || a.stage === 'Onsite').length} Active
          </span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Offers Received</span>
          <span className="text-2xl font-black text-brand-teal mt-1 block">
            {applications.filter(a => a.stage === 'Offer').length} Offers 🏁
          </span>
        </div>
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Placement Rate</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {applications.length > 0 ? Math.round((applications.filter(a => a.stage === 'Offer').length / applications.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Add application form */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Placement Log
        </h3>
        <form onSubmit={addApplication} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Company Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Google"
              className="w-full px-4 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Target Role</label>
            <input
              type="text"
              required
              placeholder="E.g. Software Engineer"
              className="w-full px-4 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Current Stage</label>
            <select
              value={stageVal}
              onChange={(e) => setStageVal(e.target.value as any)}
              className="w-full px-4 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Screen">Technical Screen</option>
              <option value="Onsite">Onsite Interview</option>
              <option value="Offer">Offer Received</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg shadow-glow"
          >
            Add Log Application
          </button>
        </form>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stg) => {
          const list = getStageList(stg);
          return (
            <div key={stg} className="p-4 rounded-xl bg-brand-card/50 border border-brand-border min-w-[200px] flex flex-col h-[350px]">
              <div className="flex justify-between items-center border-b border-brand-border pb-2 mb-3">
                <span className="text-xs font-bold uppercase text-white">{stg}</span>
                <span className="text-[10px] font-bold text-gray-500 bg-brand-dark px-2 py-0.5 rounded border border-brand-border/40">
                  {list.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {list.map((app) => (
                  <div key={app.id} className="p-3 rounded-lg bg-brand-dark/60 border border-brand-border/30 text-xs flex flex-col justify-between h-24">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        {app.company}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">{app.role}</p>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-gray-500 border-t border-brand-border/20 pt-1.5 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {app.date}
                      </span>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete log"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacementDashboard;

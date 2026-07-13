import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X } from 'lucide-react';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { name: 'Go to Dashboard', path: '/' },
    { name: 'Launch DSA Visualizer', path: '/visualizer' },
    { name: 'Open AI Notebook', path: '/visualizer/notebook' },
    { name: 'Open Whiteboard Canvas', path: '/visualizer/whiteboard' },
    { name: 'Open Pomodoro Planner', path: '/visualizer/planner' },
    { name: 'Enter Recruiter Mock Lab', path: '/visualizer/interview-lab' },
    { name: 'Enter Contest Arena', path: '/visualizer/contests' }
  ];

  const filteredCommands = commands.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <div className="w-full max-w-lg rounded-2xl bg-brand-card border border-brand-border shadow-glow overflow-hidden animate-fade-in">
        {/* Search Input bar */}
        <div className="p-4 bg-brand-dark/40 border-b border-brand-border flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            required
            autoFocus
            placeholder="Search commands, pages, visualizers... (E.g. Whiteboard)"
            className="flex-1 bg-transparent text-sm text-white focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="p-3 max-h-60 overflow-y-auto space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.name}
                onClick={() => handleSelect(cmd.path)}
                className="w-full p-3 rounded-xl hover:bg-[#111A2C] border border-transparent hover:border-brand-border/40 text-left text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Command className="w-4 h-4 text-indigo-400" />
                  {cmd.name}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase bg-brand-dark px-2 py-0.5 rounded border border-brand-border/30">Jump</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">No matching page commands found.</p>
          )}
        </div>

        <div className="p-3 bg-brand-dark/20 border-t border-brand-border/40 text-[10px] text-gray-500 text-center">
          Press <kbd className="bg-brand-dark px-1.5 py-0.5 rounded border border-brand-border/40">Ctrl + K</kbd> to toggle command palette.
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

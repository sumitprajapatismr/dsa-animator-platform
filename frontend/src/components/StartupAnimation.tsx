import React, { useEffect, useState } from 'react';
import { useAppTheme } from '../context/ThemeContext';

interface StartupProps {
  userName: string;
  onComplete: () => void;
}

const StartupAnimation: React.FC<StartupProps> = ({ userName, onComplete }) => {
  const [stage, setStage] = useState(0); // 0: Neural Net, 1: Float Tags, 2: Brain Glow, 3: Welcome & Progress, 4: Done
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Stage triggers
    const t1 = setTimeout(() => setStage(1), 1000);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(() => setStage(3), 3500);
    const t4 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Loading bar incrementor
  useEffect(() => {
    if (stage >= 3) {
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 8;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const floatTags = ['Arrays', 'Linked List', 'Trees', 'Graphs', 'DP', 'AI', 'Algorithms'];

  return (
    <div className="fixed inset-0 bg-[#000000] z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none transition-opacity duration-1000">
      
      {/* 1. Neural Net connections */}
      {stage <= 1 && (
        <div className="absolute inset-0 opacity-40 animate-pulse pointer-events-none">
          <svg className="w-full h-full">
            <line x1="20%" y1="30%" x2="40%" y2="50%" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="5,5" />
            <line x1="40%" y1="50%" x2="60%" y2="40%" stroke="#06B6D4" strokeWidth="1.5" />
            <line x1="60%" y1="40%" x2="80%" y2="70%" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="5,5" />
            <line x1="40%" y1="50%" x2="50%" y2="80%" stroke="#A855F7" strokeWidth="1.5" />
            
            {/* Glowing nodes */}
            <circle cx="20%" cy="30%" r="5" fill="#4F46E5" />
            <circle cx="40%" cy="50%" r="6" fill="#06B6D4" className="animate-ping" />
            <circle cx="60%" cy="40%" r="5" fill="#A855F7" />
            <circle cx="80%" cy="70%" r="4" fill="#4F46E5" />
            <circle cx="50%" cy="80%" r="5" fill="#06B6D4" />
          </svg>
        </div>
      )}

      {/* 2. Floating tags */}
      {stage === 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {floatTags.map((tag, idx) => (
            <span
              key={idx}
              className="absolute text-xs font-mono font-bold tracking-widest text-indigo-400/40 uppercase animate-pulse"
              style={{
                top: `${20 + idx * 10}%`,
                left: `${15 + (idx * 12) % 70}%`,
                animationDelay: `${idx * 0.2}s`
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 3. Glowing Digital Brain & Text */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10">
        
        {/* Glow Brain Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center shadow-glow animate-pulse">
            <span className="text-4xl">🧠</span>
          </div>
          
          {/* Orbital glowing pulse rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-125 animate-ping duration-1000" />
          <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-150 animate-ping duration-1500" />
        </div>

        {/* Brand Display */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Brain DSA AI
          </h1>
          
          {/* Dynamic subtext cycles */}
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            {stage === 0 && 'Forming Neural Networks...'}
            {stage === 1 && 'Mapping Algorithms...'}
            {stage === 2 && 'Learn • Visualize • Practice • Master'}
            {stage >= 3 && `Welcome back, ${userName || 'User'}`}
          </p>
        </div>

        {/* 4. Welcome message & Progress Loading bar */}
        {stage >= 3 && (
          <div className="w-48 space-y-2">
            <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden border border-brand-border/20">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1 rounded-full transition-all duration-100" 
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="block text-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              Initializing Dashboard...
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default StartupAnimation;

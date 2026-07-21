import React, { useState, useEffect } from 'react';
import { playSoundTone } from '../utils/audio';
import { Sparkles, Settings, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

const ThreeDPlayground: React.FC = () => {
  // Settings Local States
  const [enable3D, setEnable3D] = useState(() => localStorage.getItem('enable3D') !== 'false');
  const [enableParticles, setEnableParticles] = useState(() => localStorage.getItem('enableParticles') !== 'false');
  const [enableSounds, setEnableSounds] = useState(() => localStorage.getItem('enableSounds') !== 'false');

  // Mouse Parallax coordinates for 3D tilt
  const [rotateX, setRotateX] = useState(10);
  const [rotateY, setRotateY] = useState(-10);

  useEffect(() => {
    localStorage.setItem('enable3D', enable3D ? 'true' : 'false');
  }, [enable3D]);

  useEffect(() => {
    localStorage.setItem('enableParticles', enableParticles ? 'true' : 'false');
  }, [enableParticles]);

  useEffect(() => {
    localStorage.setItem('enableSounds', enableSounds ? 'true' : 'false');
  }, [enableSounds]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enable3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Constrain rotation bounds
    setRotateY((x / rect.width) * 35);
    setRotateX(-(y / rect.height) * 35);
  };

  const handleMouseLeave = () => {
    setRotateX(10);
    setRotateY(-10);
  };

  const triggerClickAudio = () => {
    playSoundTone('click');
  };

  const triggerSuccessAudio = () => {
    playSoundTone('success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Immersive 3D Experience</h1>
        <p className="mt-2 text-sm text-gray-400">Interact with GPU-accelerated CSS 3D perspective panels and test audio feedbacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tiltable 3D Canvas */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-2 p-8 rounded-2xl bg-brand-card border border-brand-border h-[400px] flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing"
          style={{ perspective: '800px' }}
        >
          {/* Floating Background Particles */}
          {enableParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute w-3 h-3 bg-indigo-500/30 rounded-full blur-sm top-10 left-20 animate-pulse" />
              <div className="absolute w-4 h-4 bg-cyan-500/20 rounded-full blur-sm bottom-16 right-20 animate-bounce" />
            </div>
          )}

          {/* 3D Extruded Node Block */}
          <div
            className="w-48 h-48 bg-indigo-600/20 border-2 border-indigo-500 rounded-2xl flex flex-col items-center justify-center transition-transform duration-100 ease-out shadow-glow z-10"
            style={{
              transform: enable3D ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)` : 'none',
              transformStyle: 'preserve-3d'
            }}
          >
            <Sparkles className="w-10 h-10 text-indigo-400 mb-2 animate-bounce" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">3D Node Object</span>
            <span className="text-[10px] text-gray-400 mt-1 font-mono">Move mouse to tilt</span>
          </div>
        </div>

        {/* Configurations panel */}
        <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Settings className="w-5 h-5" /> Motion & Audio Toggles
          </h3>

          <div className="space-y-4">
            {/* 3D switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-semibold">Enable 3D Tilt Parallax</span>
              <button
                onClick={() => {
                  setEnable3D(!enable3D);
                  playSoundTone('click');
                }}
                className={`p-2 rounded-lg border transition-all ${enable3D ? 'bg-indigo-650/40 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border text-gray-500'}`}
              >
                {enable3D ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Particles switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-semibold">Floating Canvas Particles</span>
              <button
                onClick={() => {
                  setEnableParticles(!enableParticles);
                  playSoundTone('click');
                }}
                className={`p-2 rounded-lg border transition-all ${enableParticles ? 'bg-indigo-650/40 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border text-gray-500'}`}
              >
                {enableParticles ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Audio switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-semibold">Synthesized Interface Audio</span>
              <button
                onClick={() => {
                  const val = !enableSounds;
                  setEnableSounds(val);
                  localStorage.setItem('enableSounds', val ? 'true' : 'false');
                  playSoundTone('click');
                }}
                className={`p-2 rounded-lg border transition-all ${enableSounds ? 'bg-indigo-650/40 border-indigo-500 text-indigo-400' : 'bg-brand-dark border-brand-border text-gray-500'}`}
              >
                {enableSounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="border-t border-brand-border/40 pt-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Trigger Test Audios:</span>
            <div className="flex gap-2">
              <button
                onClick={triggerClickAudio}
                className="flex-1 py-2 bg-brand-dark border border-brand-border text-[10px] font-bold text-gray-400 hover:text-white rounded-lg"
              >
                Trigger Click
              </button>
              <button
                onClick={triggerSuccessAudio}
                className="flex-1 py-2 bg-indigo-600/10 border border-indigo-500/40 text-[10px] font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg"
              >
                Trigger Level-Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDPlayground;


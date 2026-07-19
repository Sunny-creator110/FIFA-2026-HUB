import React, { useState } from 'react';

export const InclusiveHub: React.FC = () => {
  const [ttsVolume, setTtsVolume] = useState(80);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [isNarrating, setIsNarrating] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#171c26] border border-white/10 p-4 rounded-2xl shadow-xl">
        <h2 className="text-xl font-headline-md font-black text-[#b5c4ff] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2bf52]">accessible</span>
          Inclusive Accessibility & Sensory Command Portal
        </h2>
        <p className="text-xs text-[#c4c5d5]">
          WCAG 2.1 AA step-free navigation, Text-to-Speech live match narration, and ASL Sign Language stream.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TTS & Audio Controls */}
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">volume_up</span>
            Live Match Text-to-Speech (TTS) Narration
          </h3>

          <div className="bg-[#0e131d] border border-white/5 p-3 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#dee2f1]">TTS Narration Engine</span>
              <button
                onClick={() => setIsNarrating(!isNarrating)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  isNarrating ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#3557bc] text-white'
                }`}
              >
                {isNarrating ? 'Active (Playing)' : 'Start Narration'}
              </button>
            </div>

            <div>
              <label className="block text-[#c4c5d5] mb-1">Volume: {ttsVolume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={ttsVolume}
                onChange={(e) => setTtsVolume(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#b5c4ff]"
              />
            </div>

            <div>
              <label className="block text-[#c4c5d5] mb-1">Speed: {ttsSpeed}x</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#b5c4ff]"
              />
            </div>
          </div>
        </div>

        {/* Sensory Quiet Zones */}
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">spa</span>
            Sensory Quiet Zones & Decibel Monitoring
          </h3>
          <div className="bg-[#0e131d] border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-[#dee2f1] block">Quiet Room 1 (Sector South - Zone 6)</span>
              <span className="text-[11px] text-emerald-400">Current Noise: 42 dB (Quiet)</span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
              Available (4 Seats)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

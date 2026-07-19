import React, { useState, useMemo } from 'react';
import { generateShiftBriefing } from '../engine/shiftBriefingEngine';
import type { IncidentItem } from '../engine/types';

export const VolunteerHub: React.FC = () => {
  const [incidents] = useState<IncidentItem[]>([
    { id: 'inc-v1', title: 'Gate 4 Wayfinding Crowd Triage', severity: 'high', zoneId: 'zone-4', status: 'open', timestamp: new Date().toISOString(), description: 'Guide fans towards auxiliary Gate 2.' },
    { id: 'inc-v2', title: 'Accessibility Escort Requested', severity: 'medium', zoneId: 'zone-3', status: 'open', timestamp: new Date().toISOString(), description: 'Wheelchair assistance from South Fan Plaza.' }
  ]);

  const briefingTasks = useMemo(() => generateShiftBriefing(incidents), [incidents]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#171c26] border border-white/10 p-4 rounded-2xl shadow-xl">
        <h2 className="text-xl font-headline-md font-black text-[#b5c4ff] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2bf52]">group</span>
          Volunteer Command & Shift Dispatch Portal
        </h2>
        <p className="text-xs text-[#c4c5d5]">
          Gamified leaderboards, real-time voice shift briefings, and team task assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Briefing */}
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">assignment</span>
            AI Shift Briefing Tasks ({briefingTasks.length} Active)
          </h3>
          {briefingTasks.map((t) => (
            <div key={t.id} className="bg-[#0e131d] border border-white/5 p-3 rounded-xl text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[#dee2f1]">{t.title}</span>
                <span className="text-[10px] font-bold text-[#f2bf52] bg-[#f2bf52]/10 px-2 py-0.5 rounded">
                  {t.roleTag}
                </span>
              </div>
              <p className="text-[#c4c5d5]">{t.instruction}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">leaderboard</span>
            Volunteer Core Leaderboard
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-[#0e131d] p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
              <span className="font-bold text-[#dee2f1]">🥇 Team Alpha (Gate 1 & 2)</span>
              <span className="font-extrabold text-[#f2bf52]">1,450 pts</span>
            </div>
            <div className="bg-[#0e131d] p-2.5 rounded-xl border border-white/5 flex justify-between items-center">
              <span className="font-bold text-[#dee2f1]">🥈 Team Bravo (Fan Plaza)</span>
              <span className="font-extrabold text-slate-300">1,280 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

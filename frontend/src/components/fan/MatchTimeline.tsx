import React from 'react';
import type { MatchEvent } from '../../engine/matchEngine';

interface Props {
  events: MatchEvent[];
}

export const MatchTimeline: React.FC<Props> = ({ events }) => {
  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[#f2bf52]">sports_soccer</span>
        Live FIFA Match Timeline
      </h3>

      <div className="relative border-l-2 border-white/10 ml-3 space-y-3 pl-4 text-xs">
        {events.map((ev) => (
          <div key={ev.id} className="relative">
            <span className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-[#b5c4ff] ring-4 ring-[#171c26]"></span>
            <div className="bg-[#0e131d] border border-white/5 p-2 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-extrabold text-[#f2bf52]">{ev.minute}'</span>{' '}
                <span className="font-semibold text-[#dee2f1]">{ev.team}</span> - {ev.description}
              </div>
              <span className="text-[10px] text-[#c4c5d5] uppercase font-bold bg-[#303540]/60 px-1.5 py-0.5 rounded">
                {ev.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

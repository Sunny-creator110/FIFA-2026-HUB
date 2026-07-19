import React from 'react';
import type { ItineraryItem } from '../../engine/types';

interface Props {
  items: ItineraryItem[];
  onToggleComplete?: (id: string) => void;
}

export const PersonalItinerary: React.FC<Props> = ({ items, onToggleComplete }) => {
  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[#f2bf52]">event_note</span>
        Personal Matchday Itinerary
      </h3>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleComplete?.(item.id)}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
              item.isCompleted
                ? 'bg-[#0e131d]/50 border-white/5 opacity-60 line-through'
                : 'bg-[#0e131d] border-white/10 hover:border-[#b5c4ff]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[#b5c4ff] text-base mt-0.5">
              {item.isCompleted ? 'check_circle' : 'schedule'}
            </span>
            <div>
              <div className="font-bold text-[#dee2f1]">
                <span className="text-[#f2bf52]">{item.time}</span> • {item.title}
              </div>
              <p className="text-[11px] text-[#c4c5d5] mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

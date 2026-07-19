import React from 'react';
import { FIFA_2026_STADIUMS } from '../../engine/stadiumDataEngine';
import type { StadiumInfo } from '../../engine/types';

interface Props {
  selectedStadiumId: string;
  onSelectStadium: (stadium: StadiumInfo) => void;
}

export const StadiumSelector: React.FC<Props> = ({ selectedStadiumId, onSelectStadium }) => {
  return (
    <div className="flex items-center gap-2 bg-[#171c26]/80 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-md shadow-md max-w-full w-full sm:w-auto">
      <span className="material-symbols-outlined text-[#f2bf52] text-lg shrink-0">stadium</span>
      <select
        value={selectedStadiumId}
        onChange={(e) => {
          const found = FIFA_2026_STADIUMS.find(s => s.id === e.target.value);
          if (found) onSelectStadium(found);
        }}
        className="bg-transparent text-xs sm:text-sm font-semibold text-[#dee2f1] outline-none cursor-pointer pr-2 w-full truncate"
        aria-label="Select FIFA 2026 Host Stadium"
      >
        {FIFA_2026_STADIUMS.map((stadium) => (
          <option key={stadium.id} value={stadium.id} className="bg-[#171c26] text-white">
            {stadium.name} ({stadium.city})
          </option>
        ))}
      </select>
    </div>
  );
};

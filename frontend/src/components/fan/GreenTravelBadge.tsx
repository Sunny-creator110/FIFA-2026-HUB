import React from 'react';
import type { SustainabilityMetrics } from '../../engine/sustainabilityEngine';

interface Props {
  metrics: SustainabilityMetrics;
}

export const GreenTravelBadge: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="bg-[#171c26] border border-emerald-500/20 rounded-2xl p-4 shadow-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-3xl text-emerald-400">eco</span>
        <div>
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            Green Stadium Badge: {metrics.badgeLevel}
          </h4>
          <p className="text-xs text-[#c4c5d5]">
            {metrics.publicTransitPercent}% fans taking Metro/Shuttle • {metrics.co2SavedKg} kg CO2 Saved
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          {metrics.solarGeneratedKw} kW Solar
        </span>
      </div>
    </div>
  );
};

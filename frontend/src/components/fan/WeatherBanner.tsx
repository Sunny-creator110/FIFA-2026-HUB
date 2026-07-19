import React from 'react';
import type { WeatherAdvisory } from '../../engine/weatherEngine';

interface Props {
  advisory: WeatherAdvisory;
}

export const WeatherBanner: React.FC<Props> = ({ advisory }) => {
  return (
    <div className={`border rounded-2xl p-3.5 shadow-xl text-xs flex items-center justify-between ${
      advisory.severity === 'alert' ? 'bg-red-900/20 border-red-500/30 text-red-200' :
      advisory.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200' : 'bg-[#171c26] border-white/10 text-[#dee2f1]'
    }`}>
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl text-[#f2bf52]">wb_sunny</span>
        <div>
          <h4 className="font-bold flex items-center gap-2">
            {advisory.advisoryTitle} ({advisory.tempC}°C • {advisory.condition})
          </h4>
          <p className="text-[11px] opacity-80 mt-0.5">{advisory.advisoryText}</p>
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <span className="text-[10px] block opacity-70">Recommended Entry</span>
        <span className="font-semibold text-[#b5c4ff]">{advisory.recommendedGate}</span>
      </div>
    </div>
  );
};

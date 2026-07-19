import React from 'react';
import type { CongestionForecast } from '../../engine/crowdAnalyticsEngine';

interface Props {
  forecasts: CongestionForecast[];
}

export const PredictiveCongestion: React.FC<Props> = ({ forecasts }) => {
  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2bf52]">trending_up</span>
          15-Min Predictive Congestion Forecast
        </h3>
        <span className="text-xs text-[#c4c5d5] bg-[#303540]/60 px-2 py-0.5 rounded">AI Forecast</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {forecasts.slice(0, 6).map((item) => (
          <div key={item.zoneId} className="bg-[#0e131d] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-[#dee2f1]">{item.zoneName}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                item.alertLevel === 'red' ? 'bg-red-500/20 text-red-400' :
                item.alertLevel === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {item.alertLevel.toUpperCase()}
              </span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <div>
                <span className="text-[10px] text-[#c4c5d5]">Current: {(item.currentDensity * 100).toFixed(0)}%</span>
                <div className="text-sm font-extrabold text-[#b5c4ff]">
                  +15m: {(item.forecast15MinDensity * 100).toFixed(0)}%
                </div>
              </div>
              <span className="text-xs font-medium text-[#c4c5d5]">
                {item.trend === 'increasing' ? '▲ Rising' : item.trend === 'decreasing' ? '▼ Falling' : '► Stable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import type { SentimentScore } from '../../engine/sentimentEngine';

interface Props {
  sentiment: SentimentScore;
}

export const FanSentiment: React.FC<Props> = ({ sentiment }) => {
  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2bf52]">mood</span>
          Crowd Sentiment Meter
        </h3>
        <span className="text-xs font-extrabold text-[#f2bf52] bg-[#f2bf52]/10 px-2 py-0.5 rounded">
          {sentiment.label} ({sentiment.score}/100)
        </span>
      </div>

      <div className="w-full bg-[#0e131d] h-3 rounded-full overflow-hidden border border-white/5 my-2">
        <div
          className="bg-gradient-to-r from-[#3557bc] via-[#f2bf52] to-[#10b981] h-full transition-all duration-500"
          style={{ width: `${sentiment.score}%` }}
        ></div>
      </div>

      <div className="space-y-1 mt-2 text-[11px] text-[#c4c5d5]">
        {sentiment.factors.map((f, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b5c4ff]"></span>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';

interface Props {
  insights?: string[];
}

export const ProactiveInsightBrief: React.FC<Props> = ({
  insights = [
    'Gate 4 density predicted to exceed 95% in 15 mins. Open auxiliary overflow turnstiles 4B.',
    'Sector S Concessions operating at low wait times (6 mins). Redirect half-time crowds to Zone 6.',
    'Metro Terminal Hub (Zone 9) peak exit demand expected at 19:30. 12 additional trains staged.'
  ]
}) => {
  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[#f2bf52]">lightbulb</span>
        Proactive AI Operational Briefings
      </h3>
      <div className="space-y-2">
        {insights.map((brief, idx) => (
          <div key={idx} className="bg-[#0e131d] border-l-2 border-[#b5c4ff] p-2.5 rounded-r-xl text-xs text-[#dee2f1]">
            <span className="font-semibold text-[#b5c4ff] block mb-0.5">Insight #{idx + 1}</span>
            {brief}
          </div>
        ))}
      </div>
    </div>
  );
};

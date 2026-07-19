import React from 'react';

interface Props {
  onActionClick: (actionKey: string) => void;
}

export const QuickActions: React.FC<Props> = ({ onActionClick }) => {
  const actions = [
    { key: 'food', label: 'Shortest Food Queue', icon: 'fastfood' },
    { key: 'restroom', label: 'Nearby Restroom', icon: 'wc' },
    { key: 'seat', label: 'Take Me To Seat', icon: 'event_seat' },
    { key: 'stepfree', label: 'Step-Free Route', icon: 'accessible' },
    { key: 'merch', label: 'Official Merch Hub', icon: 'shopping_bag' },
    { key: 'weather', label: 'Weather Forecast', icon: 'cloud' },
    { key: 'stats', label: 'Live Match Stats', icon: 'equalizer' },
    { key: 'sos', label: 'SOS Emergency', icon: 'emergency', isAlert: true }
  ];

  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <h3 className="text-sm font-bold text-[#b5c4ff] mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#f2bf52]">bolt</span>
        Fan Quick Actions (8 Concierge Buttons)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.key}
            onClick={() => onActionClick(act.key)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              act.isAlert
                ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                : 'bg-[#0e131d] border-white/10 text-[#dee2f1] hover:border-[#b5c4ff]/50 hover:bg-[#1a2130]'
            }`}
            aria-label={act.label}
          >
            <span className="material-symbols-outlined text-lg">{act.icon}</span>
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

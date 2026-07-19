import React, { useState } from 'react';
import type { IncidentItem } from '../../engine/types';

interface Props {
  incidents: IncidentItem[];
  onDispatch: (incidentId: string, staffName: string) => void;
}

export const StaffCopilot: React.FC<Props> = ({ incidents, onDispatch }) => {
  const [staffName, setStaffName] = useState('Unit 4 - Security Core');

  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">smart_toy</span>
            AI Staff Copilot & Dispatch
          </h3>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Online</span>
        </div>

        <p className="text-xs text-[#c4c5d5] mb-3">
          Automated priority triage recommending nearest available venue staff for active incidents.
        </p>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {incidents.filter(i => i.status !== 'resolved').slice(0, 3).map((inc) => (
            <div key={inc.id} className="bg-[#0e131d] border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#dee2f1] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${inc.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                  {inc.title}
                </div>
                <span className="text-[10px] text-[#c4c5d5]">{inc.zoneId} • {inc.description}</span>
              </div>
              <button
                onClick={() => onDispatch(inc.id, staffName)}
                disabled={inc.status === 'dispatched'}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  inc.status === 'dispatched'
                    ? 'bg-emerald-500/20 text-emerald-300 cursor-not-allowed'
                    : 'bg-[#3557bc] hover:bg-[#4367d4] text-white shadow'
                }`}
              >
                {inc.status === 'dispatched' ? `Dispatched (${inc.assignedStaff})` : 'Dispatch Unit'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

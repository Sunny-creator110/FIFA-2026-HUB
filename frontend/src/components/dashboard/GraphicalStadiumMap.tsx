import React from 'react';
import type { StadiumZone, ZoneId } from '../../engine/types';

interface Props {
  zones: StadiumZone[];
  activeZoneId?: ZoneId;
  onSelectZone?: (zoneId: ZoneId) => void;
  highlightedRoute?: ZoneId[];
}

export const GraphicalStadiumMap: React.FC<Props> = ({
  zones,
  activeZoneId,
  onSelectZone,
  highlightedRoute = []
}) => {
  const getZoneColor = (zone: StadiumZone) => {
    if (highlightedRoute.includes(zone.id)) return '#3557bc';
    if (zone.status === 'compromised') return '#ff5252';
    if (zone.status === 'critical' || zone.isBottleneck) return '#ef4444';
    if (zone.status === 'congested') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2bf52]">map</span>
          Interactive SVG Stadium Zone Map (9 Zones)
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10b981]"></span> Normal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span> Congested</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#ef4444] animate-pulse"></span> Critical Gate 4</span>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] bg-[#0e131d] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center p-4">
        <svg viewBox="0 0 800 450" className="w-full h-full">
          {/* Pitch Field */}
          <rect x="250" y="125" width="300" height="200" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
          <line x1="400" y1="125" x2="400" y2="325" stroke="#10b981" strokeWidth="2" />
          <circle cx="400" cy="225" r="40" fill="none" stroke="#10b981" strokeWidth="2" />

          {/* Zones */}
          {/* Zone 1 North Gate */}
          <g
            onClick={() => onSelectZone?.('zone-1')}
            className="cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="button"
            aria-label="Zone 1 North Gate"
          >
            <rect x="250" y="30" width="300" height="65" rx="8" fill={getZoneColor(zones[0])} opacity="0.85" />
            <text x="400" y="68" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">
              Zone 1: North Gate 1 ({(zones[0]?.density * 100).toFixed(0)}%)
            </text>
          </g>

          {/* Zone 2 East Gate */}
          <g
            onClick={() => onSelectZone?.('zone-2')}
            className="cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="button"
            aria-label="Zone 2 East Gate"
          >
            <rect x="580" y="125" width="180" height="95" rx="8" fill={getZoneColor(zones[1])} opacity="0.85" />
            <text x="670" y="178" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">
              Zone 2: East Gate 2
            </text>
          </g>

          {/* Zone 3 South Fan Plaza */}
          <g
            onClick={() => onSelectZone?.('zone-3')}
            className="cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="button"
            aria-label="Zone 3 South Plaza"
          >
            <rect x="250" y="355" width="300" height="65" rx="8" fill={getZoneColor(zones[2])} opacity="0.85" />
            <text x="400" y="393" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">
              Zone 3: South Fan Plaza (Gate 3)
            </text>
          </g>

          {/* Zone 4 West VIP & Gate 4 */}
          <g
            onClick={() => onSelectZone?.('zone-4')}
            className="cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="button"
            aria-label="Zone 4 Gate 4 Bottleneck"
          >
            <rect x="40" y="125" width="180" height="95" rx="8" fill={getZoneColor(zones[3])} opacity="0.9" />
            <text x="130" y="178" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">
              Zone 4: Gate 4 (Critical)
            </text>
          </g>

          {/* Zone 9 Transit Terminal */}
          <g
            onClick={() => onSelectZone?.('zone-9')}
            className="cursor-pointer transition-transform hover:scale-105"
            tabIndex={0}
            role="button"
            aria-label="Zone 9 Metro Hub"
          >
            <rect x="40" y="240" width="180" height="85" rx="8" fill={getZoneColor(zones[8])} opacity="0.85" />
            <text x="130" y="288" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">
              Zone 9: Metro Terminal Hub
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

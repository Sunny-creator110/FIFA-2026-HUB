import React, { useState, useMemo } from 'react';
import { generateDefaultStadiumState, FIFA_2026_STADIUMS } from '../engine/stadiumDataEngine';
import { forecastZoneCongestion, computeTotalOccupancy } from '../engine/crowdAnalyticsEngine';
import { sortIncidentsByPriority, assignStaffToIncident } from '../engine/incidentEngine';
import type { IncidentItem, StadiumInfo, ZoneId } from '../engine/types';
import { GraphicalStadiumMap } from './dashboard/GraphicalStadiumMap';
import { PredictiveCongestion } from './dashboard/PredictiveCongestion';
import { StaffCopilot } from './dashboard/StaffCopilot';
import { ProactiveInsightBrief } from './dashboard/ProactiveInsightBrief';
import { StadiumSelector } from './stadium/StadiumSelector';

export const OpsDashboard: React.FC = () => {
  const [selectedStadium, setSelectedStadium] = useState<StadiumInfo>(FIFA_2026_STADIUMS[0]);
  const stadiumState = useMemo(() => generateDefaultStadiumState(selectedStadium.id), [selectedStadium.id]);
  
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    { id: 'inc-1', title: 'Gate 4 Turnstile Queue Surge', severity: 'critical', zoneId: 'zone-4', status: 'open', timestamp: new Date().toISOString(), description: 'Queue wait time exceeded 25 mins.' },
    { id: 'inc-2', title: 'Medical Assist at Section E12', severity: 'high', zoneId: 'zone-7', status: 'open', timestamp: new Date().toISOString(), description: 'Minor hydration assistance requested.' },
    { id: 'inc-3', title: 'Sensory Room Capacity Reached', severity: 'medium', zoneId: 'zone-6', status: 'open', timestamp: new Date().toISOString(), description: 'Quiet zone 80% occupied.' }
  ]);

  const [activeZone, setActiveZone] = useState<ZoneId>('zone-4');
  const congestionForecasts = useMemo(() => forecastZoneCongestion(stadiumState.zones, stadiumState.score.minute), [stadiumState]);
  const occupancyInfo = useMemo(() => computeTotalOccupancy(stadiumState.zones), [stadiumState.zones]);
  const sortedIncidents = useMemo(() => sortIncidentsByPriority(incidents), [incidents]);

  const handleDispatch = (incidentId: string, staffName: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? assignStaffToIncident(inc, staffName) : inc));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Stadium Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171c26] border border-white/10 p-4 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-headline-md font-black text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">query_stats</span>
            Stadium Operations Intelligence Dashboard
          </h2>
          <p className="text-xs text-[#c4c5d5]">
            Real-time telemetry, 9-zone crowd density heatmaps, and AI Staff Copilot for FIFA World Cup 2026.
          </p>
        </div>
        <StadiumSelector
          selectedStadiumId={selectedStadium.id}
          onSelectStadium={setSelectedStadium}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[11px] text-[#c4c5d5] block font-bold">Total Stadium Occupancy</span>
          <span className="text-xl font-extrabold text-[#b5c4ff]">{occupancyInfo.totalOccupancy.toLocaleString()} / {stadiumState.capacity.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">{(occupancyInfo.overallDensity * 100).toFixed(1)}% Capacity</span>
        </div>
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[11px] text-[#c4c5d5] block font-bold">Solar Power Generation</span>
          <span className="text-xl font-extrabold text-emerald-400">{stadiumState.solarPowerKw} kW</span>
          <span className="text-[10px] text-[#c4c5d5] block mt-0.5">Green Energy Grid</span>
        </div>
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[11px] text-[#c4c5d5] block font-bold">Smart Waste Fill Average</span>
          <span className="text-xl font-extrabold text-[#f2bf52]">{stadiumState.wasteFillPercent}%</span>
          <span className="text-[10px] text-[#c4c5d5] block mt-0.5">Compactor Sensors Active</span>
        </div>
        <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[11px] text-[#c4c5d5] block font-bold">Active Incidents</span>
          <span className="text-xl font-extrabold text-red-400">{sortedIncidents.filter(i => i.status !== 'resolved').length}</span>
          <span className="text-[10px] text-red-300 block font-semibold mt-0.5">Priority Sorted</span>
        </div>
      </div>

      {/* Main Grid: Graphical Map & Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GraphicalStadiumMap
            zones={stadiumState.zones}
            activeZoneId={activeZone}
            onSelectZone={setActiveZone}
          />
          <PredictiveCongestion forecasts={congestionForecasts} />
        </div>

        <div className="space-y-6">
          <StaffCopilot incidents={sortedIncidents} onDispatch={handleDispatch} />
          <ProactiveInsightBrief />
        </div>
      </div>
    </div>
  );
};

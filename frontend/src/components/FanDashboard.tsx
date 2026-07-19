import React, { useState, useMemo } from 'react';
import { generateDefaultStadiumState, FIFA_2026_STADIUMS } from '../engine/stadiumDataEngine';
import { getContextRecommendations } from '../engine/contextDecisionEngine';
import { generateMatchTimeline } from '../engine/matchEngine';
import { generatePersonalItinerary } from '../engine/itineraryEngine';
import { generateWeatherAdvisory } from '../engine/weatherEngine';
import { computeCrowdSentiment } from '../engine/sentimentEngine';
import { calculateSustainabilityMetrics } from '../engine/sustainabilityEngine';
import { findShortestPath } from '../engine/navigationEngine';
import { StadiumSelector } from './stadium/StadiumSelector';
import { MatchTimeline } from './fan/MatchTimeline';
import { PersonalItinerary } from './fan/PersonalItinerary';
import { WeatherBanner } from './fan/WeatherBanner';
import { FanSentiment } from './fan/FanSentiment';
import { GreenTravelBadge } from './fan/GreenTravelBadge';
import { QuickActions } from './fan/QuickActions';
import type { StadiumInfo, ZoneId } from '../engine/types';

export const FanDashboard: React.FC = () => {
  const [selectedStadium, setSelectedStadium] = useState<StadiumInfo>(FIFA_2026_STADIUMS[0]);
  const stadiumState = useMemo(() => generateDefaultStadiumState(selectedStadium.id), [selectedStadium.id]);
  
  const [userZone, setUserZone] = useState<ZoneId>('zone-3');
  const [targetZone, setTargetZone] = useState<ZoneId>('zone-6');

  const recommendations = useMemo(() => getContextRecommendations('fan', userZone, stadiumState), [userZone, stadiumState]);
  const matchEvents = useMemo(() => generateMatchTimeline(), []);
  const itineraryItems = useMemo(() => generatePersonalItinerary(stadiumState.matchPhase), [stadiumState.matchPhase]);
  const weatherAdvisory = useMemo(() => generateWeatherAdvisory(stadiumState.weather.tempC, stadiumState.weather.condition), [stadiumState.weather]);
  const crowdSentiment = useMemo(() => computeCrowdSentiment(stadiumState.score.scoreA, stadiumState.score.scoreB, 34, 1), [stadiumState.score]);
  const sustainabilityMetrics = useMemo(() => calculateSustainabilityMetrics(64000, stadiumState.capacity, stadiumState.solarPowerKw, stadiumState.wasteFillPercent), [stadiumState]);

  const navRoute = useMemo(() => findShortestPath(userZone, targetZone, false), [userZone, targetZone]);

  const handleQuickAction = (key: string) => {
    if (key === 'food') setTargetZone('zone-6');
    if (key === 'seat') setTargetZone('zone-7');
    if (key === 'restroom') setTargetZone('zone-5');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171c26] border border-white/10 p-4 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-headline-md font-black text-[#b5c4ff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2bf52]">smart_toy</span>
            FIFA Fan Concierge & Wayfinding Hub
          </h2>
          <p className="text-xs text-[#c4c5d5]">
            Personalized, context-aware stadium navigation, live timeline, and shortest queue finder.
          </p>
        </div>
        <StadiumSelector selectedStadiumId={selectedStadium.id} onSelectStadium={setSelectedStadium} />
      </div>

      <WeatherBanner advisory={weatherAdvisory} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions onActionClick={handleQuickAction} />

          {/* Navigation Route Card */}
          <div className="bg-[#171c26] border border-white/10 rounded-2xl p-4 shadow-xl text-xs space-y-2">
            <h3 className="text-sm font-bold text-[#b5c4ff] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2bf52]">near_me</span>
              Dijkstra Zone Navigation Path
            </h3>
            <div className="bg-[#0e131d] border border-white/5 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[#c4c5d5]">Route:</span>{' '}
                <span className="font-extrabold text-[#dee2f1]">{navRoute.sourceZone} ➔ {navRoute.destinationZone}</span>
              </div>
              <div className="text-right font-semibold text-[#b5c4ff]">
                {navRoute.totalDistanceMeters}m ({navRoute.totalTimeMinutes} min walk)
              </div>
            </div>
          </div>

          <MatchTimeline events={matchEvents} />
        </div>

        <div className="space-y-6">
          <FanSentiment sentiment={crowdSentiment} />
          <PersonalItinerary items={itineraryItems} />
          <GreenTravelBadge metrics={sustainabilityMetrics} />
        </div>
      </div>
    </div>
  );
};

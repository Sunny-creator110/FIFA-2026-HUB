import { describe, it, expect } from 'vitest';
import { getContextRecommendations } from '../engine/contextDecisionEngine';
import { generateDefaultStadiumState } from '../engine/stadiumDataEngine';

describe('Context Decision Engine Unit Tests', () => {
  it('should generate urgent bottleneck alert for staff role', () => {
    const state = generateDefaultStadiumState();
    const recs = getContextRecommendations('staff', 'zone-1', state);
    const bottleneckRec = recs.find(r => r.id.includes('rec-bottleneck'));
    expect(bottleneckRec).toBeDefined();
    expect(bottleneckRec?.priority).toBe('urgent');
  });

  it('should generate alternative gate recommendation for fan role when bottleneck occurs', () => {
    const state = generateDefaultStadiumState();
    const recs = getContextRecommendations('fan', 'zone-4', state);
    const fanRec = recs.find(r => r.id.includes('rec-fan-avoid'));
    expect(fanRec).toBeDefined();
    expect(fanRec?.priority).toBe('high');
  });

  it('should include step-free navigation recommendation when accessibility requested', () => {
    const state = generateDefaultStadiumState();
    const recs = getContextRecommendations('fan', 'zone-1', state, true);
    const stepFreeRec = recs.find(r => r.id === 'rec-step-free');
    expect(stepFreeRec).toBeDefined();
    expect(stepFreeRec?.category).toBe('facility');
  });

  it('should recommend Sector S concessions during half-time phase', () => {
    const state = generateDefaultStadiumState();
    state.matchPhase = 'half-time';
    const recs = getContextRecommendations('fan', 'zone-1', state);
    const halfTimeRec = recs.find(r => r.id === 'rec-halftime-food');
    expect(halfTimeRec).toBeDefined();
    expect(halfTimeRec?.targetZone).toBe('zone-6');
  });

  it('should recommend metro transit hub during post-match phase', () => {
    const state = generateDefaultStadiumState();
    state.matchPhase = 'post-match';
    const recs = getContextRecommendations('fan', 'zone-1', state);
    const postMatchRec = recs.find(r => r.id === 'rec-postmatch-exit');
    expect(postMatchRec).toBeDefined();
    expect(postMatchRec?.targetZone).toBe('zone-9');
  });

  it('should trigger heat advisory recommendation when temp is over 30C', () => {
    const state = generateDefaultStadiumState();
    state.weather.tempC = 34;
    state.weather.condition = 'extreme_heat';
    const recs = getContextRecommendations('fan', 'zone-1', state);
    const heatRec = recs.find(r => r.id === 'rec-heat-advisory');
    expect(heatRec).toBeDefined();
    expect(heatRec?.category).toBe('sustainability');
  });
});

import { describe, it, expect } from 'vitest';
import { estimateWaitTimeMinutes, getWaitTimeSeverity, findShortestQueueZone, calculateAverageWaitTime } from '../engine/waitTimeEngine';
import { generateDefaultStadiumState } from '../engine/stadiumDataEngine';

describe('Wait Time Engine Unit Tests', () => {
  it('should estimate wait time in minutes accurately based on queue length', () => {
    expect(estimateWaitTimeMinutes(150, 15)).toBe(10);
    expect(estimateWaitTimeMinutes(300, 15)).toBe(20);
    expect(estimateWaitTimeMinutes(0, 15)).toBe(1);
  });

  it('should classify wait time severity levels', () => {
    expect(getWaitTimeSeverity(30)).toBe('critical');
    expect(getWaitTimeSeverity(18)).toBe('high');
    expect(getWaitTimeSeverity(10)).toBe('moderate');
    expect(getWaitTimeSeverity(4)).toBe('low');
  });

  it('should find the zone with the shortest queue for food courts', () => {
    const state = generateDefaultStadiumState();
    const shortestFood = findShortestQueueZone(state.zones, 'food');
    expect(shortestFood).toBeDefined();
    expect(shortestFood?.id).toBe('zone-6'); // Zone 6 wait time is 7 mins vs Zone 5 is 18 mins
  });

  it('should calculate overall average wait time across all zones', () => {
    const state = generateDefaultStadiumState();
    const avg = calculateAverageWaitTime(state.zones);
    expect(avg).toBeGreaterThan(0);
    expect(avg).toBeLessThan(30);
  });
});

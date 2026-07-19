import { describe, it, expect } from 'vitest';
import {
  calculateZoneDensity,
  isZoneBottleneck,
  getZoneStatus,
  computeTotalOccupancy,
  detectBottleneckZones,
  forecastZoneCongestion
} from '../engine/crowdAnalyticsEngine';
import { generateDefaultStadiumState } from '../engine/stadiumDataEngine';

describe('Crowd Analytics Engine Unit Tests', () => {
  it('should calculate zone density correctly', () => {
    expect(calculateZoneDensity(50, 100)).toBe(0.5);
    expect(calculateZoneDensity(100, 100)).toBe(1.0);
    expect(calculateZoneDensity(0, 100)).toBe(0);
    expect(calculateZoneDensity(150, 100)).toBe(1.0); // Clamped at 1.0
  });

  it('should handle zero or negative capacity gracefully', () => {
    expect(calculateZoneDensity(50, 0)).toBe(0);
    expect(calculateZoneDensity(50, -10)).toBe(0);
  });

  it('should identify bottleneck zones based on density or wait time threshold', () => {
    expect(isZoneBottleneck(0.92, 10)).toBe(true);
    expect(isZoneBottleneck(0.70, 25)).toBe(true);
    expect(isZoneBottleneck(0.60, 5)).toBe(false);
  });

  it('should classify zone status levels accurately', () => {
    expect(getZoneStatus(0.95)).toBe('critical');
    expect(getZoneStatus(0.80)).toBe('congested');
    expect(getZoneStatus(0.50)).toBe('normal');
    expect(getZoneStatus(0.50, true)).toBe('compromised');
  });

  it('should compute overall stadium occupancy metrics', () => {
    const state = generateDefaultStadiumState('metlife');
    const totals = computeTotalOccupancy(state.zones);
    expect(totals.totalOccupancy).toBeGreaterThan(0);
    expect(totals.totalCapacity).toBeGreaterThan(totals.totalOccupancy);
    expect(totals.overallDensity).toBeGreaterThan(0);
    expect(totals.overallDensity).toBeLessThanOrEqual(1.0);
  });

  it('should filter bottleneck zones correctly', () => {
    const state = generateDefaultStadiumState('metlife');
    const bottlenecks = detectBottleneckZones(state.zones);
    expect(bottlenecks.length).toBeGreaterThan(0);
    expect(bottlenecks.some(z => z.id === 'zone-4')).toBe(true);
  });

  it('should generate 15-minute congestion forecasts', () => {
    const state = generateDefaultStadiumState('metlife');
    const forecasts = forecastZoneCongestion(state.zones, 42); // 42nd minute
    expect(forecasts).toHaveLength(state.zones.length);
    const foodForecast = forecasts.find(f => f.zoneId === 'zone-5');
    expect(foodForecast).toBeDefined();
    expect(foodForecast?.forecast15MinDensity).toBeGreaterThanOrEqual(0.8);
  });

  it('should assign correct alert levels in congestion forecast', () => {
    const state = generateDefaultStadiumState('metlife');
    const forecasts = forecastZoneCongestion(state.zones, 88);
    const criticalGate = forecasts.find(f => f.zoneId === 'zone-4');
    expect(criticalGate?.alertLevel).toBe('red');
  });
});

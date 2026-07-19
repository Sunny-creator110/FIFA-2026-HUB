import type { StadiumZone } from './types';

export function estimateWaitTimeMinutes(peopleInQueue: number, serviceRatePerMin: number = 15): number {
  if (serviceRatePerMin <= 0) return 0;
  return Math.max(1, Math.round(peopleInQueue / serviceRatePerMin));
}

export function getWaitTimeSeverity(waitMinutes: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (waitMinutes >= 25) return 'critical';
  if (waitMinutes >= 15) return 'high';
  if (waitMinutes >= 8) return 'moderate';
  return 'low';
}

export function findShortestQueueZone(zones: StadiumZone[], category: 'gate' | 'food' | 'all' = 'all'): StadiumZone | null {
  let filtered = zones;
  if (category === 'gate') {
    filtered = zones.filter(z => z.id === 'zone-1' || z.id === 'zone-2' || z.id === 'zone-3' || z.id === 'zone-4' || z.id === 'zone-9');
  } else if (category === 'food') {
    filtered = zones.filter(z => z.id === 'zone-5' || z.id === 'zone-6');
  }

  if (filtered.length === 0) return null;

  return filtered.reduce((shortest, current) => {
    return current.avgWaitMinutes < shortest.avgWaitMinutes ? current : shortest;
  }, filtered[0]);
}

export function calculateAverageWaitTime(zones: StadiumZone[]): number {
  if (zones.length === 0) return 0;
  const total = zones.reduce((sum, z) => sum + z.avgWaitMinutes, 0);
  return Number((total / zones.length).toFixed(1));
}

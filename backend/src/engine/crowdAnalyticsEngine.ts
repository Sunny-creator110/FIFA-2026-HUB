import type { StadiumZone, ZoneId } from './types';

export function calculateZoneDensity(currentOccupancy: number, capacity: number): number {
  if (capacity <= 0) return 0;
  const density = currentOccupancy / capacity;
  return Math.min(Math.max(density, 0), 1);
}

export function isZoneBottleneck(density: number, avgWaitMinutes: number): boolean {
  return density >= 0.90 || avgWaitMinutes >= 20;
}

export function getZoneStatus(density: number, isCompromised: boolean = false): 'normal' | 'congested' | 'critical' | 'compromised' {
  if (isCompromised) return 'compromised';
  if (density >= 0.90) return 'critical';
  if (density >= 0.75) return 'congested';
  return 'normal';
}

export function computeTotalOccupancy(zones: StadiumZone[]): { totalOccupancy: number; totalCapacity: number; overallDensity: number } {
  const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const overallDensity = totalCapacity > 0 ? totalOccupancy / totalCapacity : 0;
  return { totalOccupancy, totalCapacity, overallDensity };
}

export function detectBottleneckZones(zones: StadiumZone[]): StadiumZone[] {
  return zones.filter(z => z.isBottleneck || z.density >= 0.90 || z.avgWaitMinutes >= 20);
}

export interface CongestionForecast {
  zoneId: ZoneId;
  zoneName: string;
  currentDensity: number;
  forecast15MinDensity: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  alertLevel: 'green' | 'yellow' | 'red';
}

export function forecastZoneCongestion(zones: StadiumZone[], matchMinute: number): CongestionForecast[] {
  return zones.map(zone => {
    let multiplier = 1.0;
    if (matchMinute >= 40 && matchMinute <= 45 && (zone.id === 'zone-5' || zone.id === 'zone-6')) {
      multiplier = 1.25;
    } else if (matchMinute >= 85 && (zone.id === 'zone-1' || zone.id === 'zone-4' || zone.id === 'zone-9')) {
      multiplier = 1.30;
    } else {
      multiplier = 0.98 + (Math.random() * 0.04);
    }

    const forecast15MinDensity = Math.min(1.0, zone.density * multiplier);
    const trend = forecast15MinDensity > zone.density + 0.03 ? 'increasing' : forecast15MinDensity < zone.density - 0.03 ? 'decreasing' : 'stable';
    const alertLevel = forecast15MinDensity >= 0.88 ? 'red' : forecast15MinDensity >= 0.72 ? 'yellow' : 'green';

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      currentDensity: Number(zone.density.toFixed(2)),
      forecast15MinDensity: Number(forecast15MinDensity.toFixed(2)),
      trend,
      alertLevel
    };
  });
}

export interface SustainabilityMetrics {
  co2SavedKg: number;
  publicTransitPercent: number;
  solarGeneratedKw: number;
  recyclingRatePercent: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum Green Stadium';
}

export function calculateSustainabilityMetrics(
  publicTransitUserCount: number,
  totalFans: number,
  solarKw: number,
  wasteFillPercent: number
): SustainabilityMetrics {
  const publicTransitPercent = totalFans > 0 ? Math.round((publicTransitUserCount / totalFans) * 100) : 78;
  const co2SavedKg = Math.round(publicTransitUserCount * 2.4);
  const recyclingRatePercent = Math.max(10, 100 - wasteFillPercent);

  let badgeLevel: SustainabilityMetrics['badgeLevel'] = 'Bronze';
  if (publicTransitPercent >= 80 && solarKw >= 400) badgeLevel = 'Platinum Green Stadium';
  else if (publicTransitPercent >= 70) badgeLevel = 'Gold';
  else if (publicTransitPercent >= 50) badgeLevel = 'Silver';

  return {
    co2SavedKg,
    publicTransitPercent,
    solarGeneratedKw: solarKw,
    recyclingRatePercent,
    badgeLevel
  };
}

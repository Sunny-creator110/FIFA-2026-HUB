import type { ContextRecommendation, MatchPhase, StadiumState, UserRole, ZoneId } from './types';

export function getContextRecommendations(
  role: UserRole,
  userZoneId: ZoneId,
  stadiumState: StadiumState,
  isAccessibilityNeeded: boolean = false
): ContextRecommendation[] {
  const recommendations: ContextRecommendation[] = [];

  const criticalZone = stadiumState.zones.find(z => z.isBottleneck || z.density >= 0.90);
  if (criticalZone) {
    if (role === 'staff' || role === 'security' || role === 'organizer') {
      recommendations.push({
        id: `rec-bottleneck-${criticalZone.id}`,
        title: `CRITICAL BOTTLENECK: ${criticalZone.gateName}`,
        description: `Zone density at ${(criticalZone.density * 100).toFixed(0)}%. Average wait is ${criticalZone.avgWaitMinutes} mins. Immediate queue redirection needed.`,
        priority: 'urgent',
        category: 'safety',
        targetZone: criticalZone.id,
        actionText: 'Dispatch Queue Control Staff'
      });
    } else {
      recommendations.push({
        id: `rec-fan-avoid-${criticalZone.id}`,
        title: `Heavy Delay at ${criticalZone.gateName}`,
        description: `Current queue time is ${criticalZone.avgWaitMinutes} mins. Consider using alternative Gate 2 or Gate 3.`,
        priority: 'high',
        category: 'navigation',
        targetZone: criticalZone.id,
        actionText: 'View Alternative Gate'
      });
    }
  }

  if (isAccessibilityNeeded) {
    recommendations.push({
      id: 'rec-step-free',
      title: 'Step-Free Wheelchair Route Active',
      description: 'Navigating via Elevators 3 & 4. Sensory quiet rooms available in Sector South.',
      priority: 'medium',
      category: 'facility',
      actionText: 'View Accessibility Map'
    });
  }

  if (stadiumState.matchPhase === 'half-time') {
    recommendations.push({
      id: 'rec-halftime-food',
      title: 'Half-Time Concessions Update',
      description: 'Sector S Food Court (Zone 6) has 60% lower wait times than Sector N.',
      priority: 'medium',
      category: 'facility',
      targetZone: 'zone-6',
      actionText: 'Navigate to Zone 6'
    });
  } else if (stadiumState.matchPhase === 'post-match') {
    recommendations.push({
      id: 'rec-postmatch-exit',
      title: 'Staggered Exit & Metro Shuttle',
      description: 'Metro Terminal Hub (Zone 9) trains running every 2 minutes. Express buses available at Gate 3.',
      priority: 'high',
      category: 'navigation',
      targetZone: 'zone-9',
      actionText: 'View Transit Times'
    });
  }

  if (stadiumState.weather.condition === 'extreme_heat' || stadiumState.weather.tempC >= 30) {
    recommendations.push({
      id: 'rec-heat-advisory',
      title: 'High Heat Advisory',
      description: `Temperature is ${stadiumState.weather.tempC}°C. Free hydration stations located at Concourse East & West.`,
      priority: 'medium',
      category: 'sustainability',
      actionText: 'Locate Hydration Station'
    });
  }

  return recommendations;
}

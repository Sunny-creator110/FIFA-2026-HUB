import { findShortestPath } from './navigationEngine';
import type { NavigationRoute, StadiumZone, ZoneId } from './types';

export interface EvacuationPlan {
  userZone: ZoneId;
  safeExitGate: string;
  safeExitZone: ZoneId;
  evacuationRoute: NavigationRoute;
  safetyAlert: string;
  recommendedActions: string[];
}

export function generateEvacuationPlan(
  userZone: ZoneId,
  compromisedZoneIds: ZoneId[],
  zones: StadiumZone[]
): EvacuationPlan {
  const exitZones: ZoneId[] = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-9'];
  const safeExitZones = exitZones.filter(z => !compromisedZoneIds.includes(z));

  const targetExit = safeExitZones.length > 0 ? safeExitZones[0] : 'zone-3';
  const targetZoneObj = zones.find(z => z.id === targetExit);
  const exitGateName = targetZoneObj ? targetZoneObj.gateName : 'Gate 3 (South)';

  const evacuationRoute = findShortestPath(userZone, targetExit, false);

  return {
    userZone,
    safeExitGate: exitGateName,
    safeExitZone: targetExit,
    evacuationRoute,
    safetyAlert: `EVACUATION NOTICE: Please proceed calmly to ${exitGateName}. Avoid high-density corridors.`,
    recommendedActions: [
      `Walk steadily towards ${exitGateName}.`,
      'Do not run or use elevators during emergency alarms.',
      'Follow ground LED emergency lighting signals.',
      'Assist children and individuals requiring mobility support.'
    ]
  };
}

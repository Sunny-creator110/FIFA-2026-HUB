import type { IncidentItem, ZoneId } from './types';

export function sortIncidentsByPriority(incidents: IncidentItem[]): IncidentItem[] {
  const severityScore: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  return [...incidents].sort((a, b) => {
    const scoreDiff = severityScore[b.severity] - severityScore[a.severity];
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export function assignStaffToIncident(
  incident: IncidentItem,
  availableStaffName: string
): IncidentItem {
  return {
    ...incident,
    status: 'dispatched',
    assignedStaff: availableStaffName
  };
}

export function filterIncidentsByZone(incidents: IncidentItem[], zoneId: ZoneId): IncidentItem[] {
  return incidents.filter(inc => inc.zoneId === zoneId);
}

export function calculateZoneIncidentSeverity(incidents: IncidentItem[], zoneId: ZoneId): 'clear' | 'low' | 'high' | 'critical' {
  const zoneIncidents = filterIncidentsByZone(incidents, zoneId).filter(i => i.status !== 'resolved');
  if (zoneIncidents.length === 0) return 'clear';
  if (zoneIncidents.some(i => i.severity === 'critical')) return 'critical';
  if (zoneIncidents.some(i => i.severity === 'high')) return 'high';
  return 'low';
}

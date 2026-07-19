import { describe, it, expect } from 'vitest';
import { sortIncidentsByPriority, assignStaffToIncident, filterIncidentsByZone, calculateZoneIncidentSeverity } from '../engine/incidentEngine';
import type { IncidentItem } from '../engine/types';

describe('Incident Engine Unit Tests', () => {
  const sampleIncidents: IncidentItem[] = [
    { id: '1', title: 'Minor Trash Overflow', severity: 'low', zoneId: 'zone-2', status: 'open', timestamp: '2026-07-19T10:00:00Z', description: 'Bin full' },
    { id: '2', title: 'Gate 4 Turnstile Jam', severity: 'critical', zoneId: 'zone-4', status: 'open', timestamp: '2026-07-19T10:05:00Z', description: 'Turnstile lock' },
    { id: '3', title: 'Medical Assist Request', severity: 'high', zoneId: 'zone-7', status: 'open', timestamp: '2026-07-19T10:02:00Z', description: 'Faint spectator' }
  ];

  it('should sort incidents by severity priority (critical > high > low)', () => {
    const sorted = sortIncidentsByPriority(sampleIncidents);
    expect(sorted[0].severity).toBe('critical');
    expect(sorted[1].severity).toBe('high');
    expect(sorted[2].severity).toBe('low');
  });

  it('should update incident status to dispatched when staff is assigned', () => {
    const incident = sampleIncidents[0];
    const updated = assignStaffToIncident(incident, 'Unit 7 - Security');
    expect(updated.status).toBe('dispatched');
    expect(updated.assignedStaff).toBe('Unit 7 - Security');
  });

  it('should filter incidents by zone correctly', () => {
    const filtered = filterIncidentsByZone(sampleIncidents, 'zone-4');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should compute zone incident severity rating', () => {
    expect(calculateZoneIncidentSeverity(sampleIncidents, 'zone-4')).toBe('critical');
    expect(calculateZoneIncidentSeverity(sampleIncidents, 'zone-7')).toBe('high');
    expect(calculateZoneIncidentSeverity(sampleIncidents, 'zone-9')).toBe('clear');
  });
});

import { describe, it, expect } from 'vitest';
import { generateShiftBriefing } from '../engine/shiftBriefingEngine';

describe('Shift Briefing Engine Unit Tests', () => {
  it('should generate shift briefing tasks with role tags for active incidents', () => {
    const tasks = generateShiftBriefing([
      { id: '1', title: 'Medical Emergency', severity: 'critical', zoneId: 'zone-7', status: 'open', timestamp: '2026-07-19T10:00:00Z', description: 'Assist spectator' }
    ]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].roleTag).toBe('Medical Core');
  });
});

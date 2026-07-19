import type { IncidentItem, ZoneId } from './types';

export interface ShiftBriefingTask {
  id: string;
  roleTag: 'Security Core' | 'Medical Core' | 'Volunteer Guide' | 'Crowd Control';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  title: string;
  instruction: string;
  zoneId: ZoneId;
}

export function generateShiftBriefing(incidents: IncidentItem[]): ShiftBriefingTask[] {
  return incidents.map(inc => {
    let roleTag: ShiftBriefingTask['roleTag'] = 'Volunteer Guide';
    if (inc.severity === 'critical' || inc.severity === 'high') {
      roleTag = inc.title.toLowerCase().includes('medical') ? 'Medical Core' : 'Security Core';
    } else if (inc.title.toLowerCase().includes('queue') || inc.title.toLowerCase().includes('congested')) {
      roleTag = 'Crowd Control';
    }

    return {
      id: `task-${inc.id}`,
      roleTag,
      priority: inc.severity,
      title: `Action required: ${inc.title}`,
      instruction: `Deploy team to ${inc.zoneId}. Maintain clear access routes and assist stadium spectators.`,
      zoneId: inc.zoneId
    };
  });
}

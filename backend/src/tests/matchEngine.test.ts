import { describe, it, expect } from 'vitest';
import { generateMatchTimeline, getMatchPhaseLabel, formatMatchScore } from '../engine/matchEngine';

describe('Match Engine Unit Tests', () => {
  it('should generate match timeline events', () => {
    const events = generateMatchTimeline();
    expect(events.length).toBeGreaterThan(0);
    expect(events.some(e => e.type === 'goal')).toBe(true);
  });

  it('should format match scores cleanly', () => {
    const scoreText = formatMatchScore({ teamA: 'USA', scoreA: 2, teamB: 'MEX', scoreB: 1, minute: 34 });
    expect(scoreText).toBe("USA 2 - 1 MEX (34')");
  });

  it('should return human readable labels for match phases', () => {
    expect(getMatchPhaseLabel('first-half')).toBe('1st Half Live');
    expect(getMatchPhaseLabel('half-time')).toBe('Half-Time Break');
  });
});

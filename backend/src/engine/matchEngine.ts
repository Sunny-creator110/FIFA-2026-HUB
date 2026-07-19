import type { MatchPhase } from './types';

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'var' | 'substitution' | 'kickoff' | 'halftime' | 'fulltime';
  team: string;
  player?: string;
  description: string;
}

export function generateMatchTimeline(): MatchEvent[] {
  return [
    { id: 'ev-1', minute: 1, type: 'kickoff', team: 'FIFA', description: 'Match Kickoff at MetLife Stadium!' },
    { id: 'ev-2', minute: 14, type: 'goal', team: 'USA', player: 'Christian Pulisic', description: 'GOAL! Pulisic strikes low left corner!' },
    { id: 'ev-3', minute: 28, type: 'yellow_card', team: 'MEX', player: 'Edson Álvarez', description: 'Yellow Card for tactical foul.' },
    { id: 'ev-4', minute: 34, type: 'goal', team: 'MEX', player: 'Santiago Giménez', description: 'GOAL! Header off corner kick!' },
    { id: 'ev-5', minute: 42, type: 'goal', team: 'USA', player: 'Folarin Balogun', description: 'GOAL! Fast counter-attack finish!' },
    { id: 'ev-6', minute: 45, type: 'halftime', team: 'FIFA', description: 'Half-time whistle. USA 2 - 1 MEX' }
  ];
}

export function getMatchPhaseLabel(phase: MatchPhase): string {
  switch (phase) {
    case 'pre-match': return 'Pre-Match Warmup';
    case 'first-half': return '1st Half Live';
    case 'half-time': return 'Half-Time Break';
    case 'second-half': return '2nd Half Live';
    case 'post-match': return 'Match Concluded';
    default: return 'Live Match';
  }
}

export function formatMatchScore(score: { teamA: string; scoreA: number; teamB: string; scoreB: number; minute: number }): string {
  return `${score.teamA} ${score.scoreA} - ${score.scoreB} ${score.teamB} (${score.minute}')`;
}

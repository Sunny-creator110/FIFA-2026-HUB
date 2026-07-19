import type { ItineraryItem, MatchPhase } from './types';

export function generatePersonalItinerary(phase: MatchPhase): ItineraryItem[] {
  return [
    {
      id: 'itin-1',
      time: '16:00',
      title: 'Arrive at Stadium Perimeter',
      description: 'Scan digital match pass at Gate 2 (East). Recommended low-congestion gate.',
      phase: 'pre-match',
      priority: 'high',
      isCompleted: phase !== 'pre-match'
    },
    {
      id: 'itin-2',
      time: '16:30',
      title: 'Fan Zone Experience & Merch',
      description: 'Visit South Fan Plaza (Zone 3) for official FIFA 2026 souvenirs.',
      phase: 'pre-match',
      priority: 'medium',
      isCompleted: phase !== 'pre-match'
    },
    {
      id: 'itin-3',
      time: '17:00',
      title: 'Take Your Seats',
      description: 'Proceed to Section E1-E20. Player pre-match warmups begin.',
      phase: 'pre-match',
      priority: 'high',
      isCompleted: phase !== 'pre-match'
    },
    {
      id: 'itin-4',
      time: '17:30',
      title: 'Match Kickoff!',
      description: 'Live commentary & instant VAR updates available in Fan Concierge app.',
      phase: 'first-half',
      priority: 'high',
      isCompleted: phase === 'half-time' || phase === 'second-half' || phase === 'post-match'
    },
    {
      id: 'itin-5',
      time: '18:15',
      title: 'Half-Time Refreshments',
      description: 'Pre-order food at Sector S Concessions (Zone 6) to skip queues.',
      phase: 'half-time',
      priority: 'medium',
      isCompleted: phase === 'second-half' || phase === 'post-match'
    },
    {
      id: 'itin-6',
      time: '19:30',
      title: 'Post-Match Departure',
      description: 'Follow LED transit guidance to Metro Shuttle Terminal (Zone 9).',
      phase: 'post-match',
      priority: 'high',
      isCompleted: false
    }
  ];
}

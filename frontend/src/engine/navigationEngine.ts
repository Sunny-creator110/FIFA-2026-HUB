import type { NavigationRoute, RouteStep, ZoneId } from './types';

interface PreviousNode {
  node: ZoneId;
  edgeLabel: string;
  distance: number;
  stepFree: boolean;
}

const ZONE_CONNECTIONS: Array<{ from: ZoneId; to: ZoneId; distance: number; stepFree: boolean; label: string }> = [
  { from: 'zone-1', to: 'zone-2', distance: 150, stepFree: true, label: 'North-East Concourse Trail' },
  { from: 'zone-1', to: 'zone-4', distance: 140, stepFree: true, label: 'North-West Ramp' },
  { from: 'zone-2', to: 'zone-3', distance: 180, stepFree: true, label: 'East Plaza Walkway' },
  { from: 'zone-2', to: 'zone-5', distance: 80, stepFree: true, label: 'Concourse to North Food Court' },
  { from: 'zone-3', to: 'zone-4', distance: 200, stepFree: true, label: 'South-West Plaza Boulevard' },
  { from: 'zone-3', to: 'zone-6', distance: 90, stepFree: true, label: 'South Plaza to South Food Court' },
  { from: 'zone-4', to: 'zone-5', distance: 110, stepFree: true, label: 'West Entrance to North Food Court' },
  { from: 'zone-5', to: 'zone-6', distance: 120, stepFree: true, label: 'Central Food Corridor' },
  { from: 'zone-5', to: 'zone-7', distance: 60, stepFree: true, label: 'North Food Court to Lower Stands E1-E20' },
  { from: 'zone-6', to: 'zone-8', distance: 130, stepFree: false, label: 'Stairs to Upper Stand W1-W20 (Elevator Available)' },
  { from: 'zone-3', to: 'zone-9', distance: 160, stepFree: true, label: 'South Gate to Transit & Metro Terminal' }
];

export function findShortestPath(
  source: ZoneId,
  destination: ZoneId,
  requireStepFree: boolean = false
): NavigationRoute {
  if (source === destination) {
    return {
      sourceZone: source,
      destinationZone: destination,
      path: [source],
      totalDistanceMeters: 0,
      totalTimeMinutes: 0,
      isStepFree: true,
      steps: []
    };
  }

  const nodes = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5', 'zone-6', 'zone-7', 'zone-8', 'zone-9'] as ZoneId[];
  const distances: Record<ZoneId, number> = {
    'zone-1': Infinity, 'zone-2': Infinity, 'zone-3': Infinity,
    'zone-4': Infinity, 'zone-5': Infinity, 'zone-6': Infinity,
    'zone-7': Infinity, 'zone-8': Infinity, 'zone-9': Infinity
  };
  const previous: Record<ZoneId, PreviousNode | null> = {
    'zone-1': null, 'zone-2': null, 'zone-3': null,
    'zone-4': null, 'zone-5': null, 'zone-6': null,
    'zone-7': null, 'zone-8': null, 'zone-9': null
  };
  const unvisited = new Set<ZoneId>(nodes);

  distances[source] = 0;

  while (unvisited.size > 0) {
    let current: ZoneId | null = null;
    let minDistance = Infinity;

    unvisited.forEach(node => {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    });

    if (!current || minDistance === Infinity || current === destination) break;
    unvisited.delete(current);

    const edges = ZONE_CONNECTIONS.filter(
      e => (e.from === current || e.to === current) && (!requireStepFree || e.stepFree)
    );

    for (const edge of edges) {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbor)) continue;

      const alt = distances[current] + edge.distance;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = { node: current, edgeLabel: edge.label, distance: edge.distance, stepFree: edge.stepFree };
      }
    }
  }

  const path: ZoneId[] = [];
  const steps: RouteStep[] = [];
  let curr: ZoneId | null = destination;

  while (curr && previous[curr]) {
    path.unshift(curr);
    const prevItem: PreviousNode = previous[curr]!;
    steps.unshift({
      fromZone: prevItem.node,
      toZone: curr,
      distanceMeters: prevItem.distance,
      estimatedMinutes: Math.ceil(prevItem.distance / 70),
      instruction: `Head along ${prevItem.edgeLabel} towards ${curr}`,
      isAccessible: prevItem.stepFree
    });
    curr = prevItem.node;
  }

  if (curr === source) {
    path.unshift(source);
  }

  const totalDistanceMeters = distances[destination] === Infinity ? 0 : distances[destination];
  const totalTimeMinutes = Math.max(1, Math.ceil(totalDistanceMeters / 70));
  const isStepFree = steps.every(s => s.isAccessible);

  return {
    sourceZone: source,
    destinationZone: destination,
    path,
    totalDistanceMeters,
    totalTimeMinutes,
    isStepFree,
    steps
  };
}

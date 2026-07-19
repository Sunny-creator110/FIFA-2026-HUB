import { describe, it, expect } from 'vitest';
import { findShortestPath } from '../engine/navigationEngine';

describe('Navigation Engine Dijkstra Unit Tests', () => {
  it('should find shortest path between Zone 1 (North Gate) and Zone 3 (South Plaza)', () => {
    const route = findShortestPath('zone-1', 'zone-3');
    expect(route.path).toBeDefined();
    expect(route.path.length).toBeGreaterThan(1);
    expect(route.totalDistanceMeters).toBeGreaterThan(0);
    expect(route.totalTimeMinutes).toBeGreaterThan(0);
  });

  it('should return single node route if source and destination are identical', () => {
    const route = findShortestPath('zone-2', 'zone-2');
    expect(route.path).toEqual(['zone-2']);
    expect(route.totalDistanceMeters).toBe(0);
    expect(route.totalTimeMinutes).toBe(0);
  });

  it('should enforce step-free path routing when step-free is required', () => {
    const route = findShortestPath('zone-6', 'zone-8', true); // Zone 8 has stairs unless step free filter handles elevators
    expect(route.isStepFree).toBe(true);
  });
});

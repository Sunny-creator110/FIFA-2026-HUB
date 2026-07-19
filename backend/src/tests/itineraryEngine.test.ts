import { describe, it, expect } from 'vitest';
import { generatePersonalItinerary } from '../engine/itineraryEngine';

describe('Itinerary Engine Unit Tests', () => {
  it('should generate personal matchday itinerary items based on match phase', () => {
    const items = generatePersonalItinerary('half-time');
    expect(items.length).toBeGreaterThan(0);
    const preMatchItem = items.find(i => i.phase === 'pre-match');
    expect(preMatchItem?.isCompleted).toBe(true);
  });
});

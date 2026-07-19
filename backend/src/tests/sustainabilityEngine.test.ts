import { describe, it, expect } from 'vitest';
import { calculateSustainabilityMetrics } from '../engine/sustainabilityEngine';

describe('Sustainability Engine Unit Tests', () => {
  it('should calculate CO2 savings and assign Platinum Green badge when transit usage >= 80%', () => {
    const metrics = calculateSustainabilityMetrics(65000, 80000, 420, 68);
    expect(metrics.badgeLevel).toBe('Platinum Green Stadium');
    expect(metrics.co2SavedKg).toBeGreaterThan(100000);
  });
});

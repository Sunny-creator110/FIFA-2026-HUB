import { describe, it, expect } from 'vitest';
import { generateWeatherAdvisory } from '../engine/weatherEngine';

describe('Weather Engine Unit Tests', () => {
  it('should generate extreme heat advisory when temp >= 30C', () => {
    const adv = generateWeatherAdvisory(34, 'extreme_heat');
    expect(adv.severity).toBe('alert');
    expect(adv.advisoryTitle).toContain('Heat Warning');
  });

  it('should generate rain advisory when condition is rainy', () => {
    const adv = generateWeatherAdvisory(20, 'rainy');
    expect(adv.severity).toBe('warning');
    expect(adv.recommendedGate).toBe('Gate 2 (East Concourse)');
  });
});

import { describe, it, expect } from 'vitest';
import { generateEvacuationPlan } from '../engine/emergencyEngine';
import { generateDefaultStadiumState } from '../engine/stadiumDataEngine';

describe('Emergency Evacuation Engine Unit Tests', () => {
  it('should generate an evacuation plan avoiding compromised zones', () => {
    const state = generateDefaultStadiumState();
    const plan = generateEvacuationPlan('zone-4', ['zone-1', 'zone-4'], state.zones);
    expect(plan).toBeDefined();
    expect(plan.safeExitZone).not.toBe('zone-1');
    expect(plan.safeExitZone).not.toBe('zone-4');
    expect(plan.recommendedActions.length).toBeGreaterThan(0);
  });
});

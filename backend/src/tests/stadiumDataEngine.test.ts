import { describe, it, expect } from 'vitest';
import { FIFA_2026_STADIUMS, generateDefaultStadiumState } from '../engine/stadiumDataEngine';

describe('Stadium Data Engine Unit Tests', () => {
  it('should support all 16 FIFA World Cup 2026 Host Stadiums', () => {
    expect(FIFA_2026_STADIUMS).toHaveLength(16);
    expect(FIFA_2026_STADIUMS.some(s => s.id === 'metlife')).toBe(true);
    expect(FIFA_2026_STADIUMS.some(s => s.id === 'azteca')).toBe(true);
    expect(FIFA_2026_STADIUMS.some(s => s.id === 'sofi')).toBe(true);
  });

  it('should generate default stadium state with 9 zones', () => {
    const state = generateDefaultStadiumState('azteca');
    expect(state.stadiumName).toBe('Estadio Azteca');
    expect(state.zones).toHaveLength(9);
  });
});

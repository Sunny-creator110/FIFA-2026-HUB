import type { StadiumInfo, StadiumState, StadiumZone } from './types';

export const FIFA_2026_STADIUMS: StadiumInfo[] = [
  { id: 'metlife', name: 'MetLife Stadium', city: 'East Rutherford / NY', country: 'USA', capacity: 82500, image: '🏟️' },
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523, image: '🏟️' },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Inglewood / LA', country: 'USA', capacity: 70240, image: '🏟️' },
  { id: 'att', name: 'AT&T Stadium', city: 'Arlington / Dallas', country: 'USA', capacity: 80000, image: '🏟️' },
  { id: 'mercedes', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 71000, image: '🏟️' },
  { id: 'nfl_hardrock', name: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', capacity: 64767, image: '🏟️' },
  { id: 'lumen', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 69000, image: '🏟️' },
  { id: 'nfl_geha', name: 'GEHA Field at Arrowhead', city: 'Kansas City', country: 'USA', capacity: 76416, image: '🏟️' },
  { id: 'lincoln', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 67594, image: '🏟️' },
  { id: 'gillette', name: 'Gillette Stadium', city: 'Foxborough / Boston', country: 'USA', capacity: 65878, image: '🏟️' },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72220, image: '🏟️' },
  { id: 'levis', name: 'Levi\'s Stadium', city: 'Santa Clara / SF', country: 'USA', capacity: 68500, image: '🏟️' },
  { id: 'bmo_field', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45736, image: '🏟️' },
  { id: 'bc_place', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500, image: '🏟️' },
  { id: 'akron', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 48071, image: '🏟️' },
  { id: 'bbva', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53500, image: '🏟️' }
];

export function generateDefaultStadiumState(stadiumId: string = 'metlife'): StadiumState {
  const stadium = FIFA_2026_STADIUMS.find(s => s.id === stadiumId) || FIFA_2026_STADIUMS[0];
  
  const zones: StadiumZone[] = [
    { id: 'zone-1', name: 'North Gate Perimeter', gateName: 'Gate 1 (North)', capacity: 10000, currentOccupancy: 8200, density: 0.82, isBottleneck: false, status: 'congested', avgWaitMinutes: 14, accessible: true },
    { id: 'zone-2', name: 'East Main Concourse', gateName: 'Gate 2 (East)', capacity: 9000, currentOccupancy: 6500, density: 0.72, isBottleneck: false, status: 'normal', avgWaitMinutes: 8, accessible: true },
    { id: 'zone-3', name: 'South Fan Plaza', gateName: 'Gate 3 (South)', capacity: 12000, currentOccupancy: 7800, density: 0.65, isBottleneck: false, status: 'normal', avgWaitMinutes: 6, accessible: true },
    { id: 'zone-4', name: 'West VIP & Gate 4 Entrance', gateName: 'Gate 4 (West)', capacity: 8500, currentOccupancy: 8160, density: 0.96, isBottleneck: true, status: 'critical', avgWaitMinutes: 28, accessible: true },
    { id: 'zone-5', name: 'Central Food Court North', gateName: 'Sector N Concessions', capacity: 7500, currentOccupancy: 6000, density: 0.80, isBottleneck: false, status: 'congested', avgWaitMinutes: 18, accessible: true },
    { id: 'zone-6', name: 'Central Food Court South', gateName: 'Sector S Concessions', capacity: 7500, currentOccupancy: 4500, density: 0.60, isBottleneck: false, status: 'normal', avgWaitMinutes: 7, accessible: true },
    { id: 'zone-7', name: 'Lower Tier Seating East', gateName: 'Stands E1-E20', capacity: 11000, currentOccupancy: 9350, density: 0.85, isBottleneck: false, status: 'congested', avgWaitMinutes: 4, accessible: true },
    { id: 'zone-8', name: 'Upper Tier Seating West', gateName: 'Stands W1-W20', capacity: 10000, currentOccupancy: 7500, density: 0.75, isBottleneck: false, status: 'normal', avgWaitMinutes: 5, accessible: false },
    { id: 'zone-9', name: 'Transit & Shuttle Terminal', gateName: 'Metro Hub Gate 9', capacity: 14000, currentOccupancy: 9800, density: 0.70, isBottleneck: false, status: 'normal', avgWaitMinutes: 10, accessible: true }
  ];

  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);

  return {
    stadiumId: stadium.id,
    stadiumName: stadium.name,
    city: stadium.city,
    country: stadium.country,
    capacity: stadium.capacity,
    totalOccupancy,
    matchPhase: 'first-half',
    score: { teamA: 'USA', scoreA: 2, teamB: 'MEX', scoreB: 1, minute: 34 },
    weather: { tempC: 26, condition: 'sunny', humidity: 55 },
    zones,
    activeIncidentsCount: 3,
    solarPowerKw: 420,
    wasteFillPercent: 68
  };
}

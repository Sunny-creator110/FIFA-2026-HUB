export type MatchPhase = 'pre-match' | 'first-half' | 'half-time' | 'second-half' | 'post-match';

export type UserRole = 'fan' | 'staff' | 'security' | 'volunteer' | 'organizer';

export type ZoneId = 'zone-1' | 'zone-2' | 'zone-3' | 'zone-4' | 'zone-5' | 'zone-6' | 'zone-7' | 'zone-8' | 'zone-9';

export interface StadiumZone {
  id: ZoneId;
  name: string;
  gateName: string;
  capacity: number;
  currentOccupancy: number;
  density: number; // 0 to 1
  isBottleneck: boolean;
  status: 'normal' | 'congested' | 'critical' | 'compromised';
  avgWaitMinutes: number;
  accessible: boolean;
}

export interface StadiumState {
  stadiumId: string;
  stadiumName: string;
  city: string;
  country: string;
  capacity: number;
  totalOccupancy: number;
  matchPhase: MatchPhase;
  score: { teamA: string; scoreA: number; teamB: string; scoreB: number; minute: number };
  weather: { tempC: number; condition: 'sunny' | 'rainy' | 'cloudy' | 'extreme_heat'; humidity: number };
  zones: StadiumZone[];
  activeIncidentsCount: number;
  solarPowerKw: number;
  wasteFillPercent: number;
}

export interface ContextRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'navigation' | 'facility' | 'safety' | 'sustainability' | 'match';
  targetZone?: ZoneId;
  actionText?: string;
}

export interface IncidentItem {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  zoneId: ZoneId;
  status: 'open' | 'dispatched' | 'resolved';
  timestamp: string;
  assignedStaff?: string;
  description: string;
}

export interface RouteStep {
  fromZone: ZoneId;
  toZone: ZoneId;
  distanceMeters: number;
  estimatedMinutes: number;
  instruction: string;
  isAccessible: boolean;
}

export interface NavigationRoute {
  sourceZone: ZoneId;
  destinationZone: ZoneId;
  path: ZoneId[];
  totalDistanceMeters: number;
  totalTimeMinutes: number;
  isStepFree: boolean;
  steps: RouteStep[];
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  phase: MatchPhase;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
}

export interface StadiumInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image: string;
}

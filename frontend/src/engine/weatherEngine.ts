export interface WeatherAdvisory {
  condition: string;
  tempC: number;
  advisoryTitle: string;
  advisoryText: string;
  recommendedGate: string;
  severity: 'info' | 'warning' | 'alert';
}

export function generateWeatherAdvisory(tempC: number, condition: string): WeatherAdvisory {
  if (condition === 'rainy') {
    return {
      condition: 'Rainy',
      tempC,
      advisoryTitle: 'Rain Advisory in Effect',
      advisoryText: 'Covered concourses open at Gate 2 & Gate 4. Waterproof poncho distribution active.',
      recommendedGate: 'Gate 2 (East Concourse)',
      severity: 'warning'
    };
  }

  if (tempC >= 30 || condition === 'extreme_heat') {
    return {
      condition: 'Extreme Heat',
      tempC,
      advisoryTitle: 'Extreme Heat Warning',
      advisoryText: 'High temperatures detected. Stay hydrated! Misting cooling stations active at South Fan Plaza.',
      recommendedGate: 'Gate 3 (South Plaza Cooling Station)',
      severity: 'alert'
    };
  }

  return {
    condition: 'Ideal Conditions',
    tempC,
    advisoryTitle: 'Optimal Weather Conditions',
    advisoryText: `Mild ${tempC}°C temperature. All outdoor fan zones open and operating smoothly.`,
    recommendedGate: 'Gate 1 (North Main Entrance)',
    severity: 'info'
  };
}

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'success',
    data: {
      gates: [
        { id: 'gate_1', name: 'Gate 1 (VIP - North)', congestion: 20, waitTime: 2, status: 'clear' },
        { id: 'gate_2', name: 'Gate 2 (East - Accessible)', congestion: 45, waitTime: 8, status: 'moderate' },
        { id: 'gate_3', name: 'Gate 3 (South)', congestion: 15, waitTime: 2, status: 'clear' },
        { id: 'gate_4', name: 'Gate 4 (West)', congestion: 92, waitTime: 28, status: 'critical' },
        { id: 'gate_5', name: 'Gate 5 (Northeast - Accessible)', congestion: 30, waitTime: 5, status: 'clear' }
      ],
      sustainability: {
        wasteBinsAverageFill: 64,
        recycleRate: 78,
        co2SavedKg: 1240,
        energySolarGenerationKwh: 450
      },
      logisticsAlerts: [
        { id: 1, type: 'warning', message: 'Gate 4 Scanner delay reported', timestamp: '11:15' },
        { id: 2, type: 'info', message: 'Metro Shuttle line capacity increased', timestamp: '11:22' }
      ],
      crowdPathStatus: {
        accessibilityRouteOpen: true,
        totalFansInStadium: 48250,
        maxCapacity: 60000
      }
    }
  });
}

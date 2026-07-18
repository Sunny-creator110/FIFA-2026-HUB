import { Router, Request, Response, NextFunction } from 'express';
import { querySchema, scenarioSchema, validateRequest } from '../middleware/validation';
import { promptGuardrails } from '../middleware/guardrails';
import { getFanAssistantResponse, getOpsScenarioResponse } from '../services/geminiService';

const router = Router();

// Endpoint for Fan Assistant
router.post(
  '/assistant/query',
  validateRequest(querySchema),
  promptGuardrails,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, language } = req.body;
      const data = await getFanAssistantResponse(query, language);
      return res.json({
        status: 'success',
        data
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint for Operations Dashboard Scenario Checklists
router.post(
  '/ops/scenario',
  validateRequest(scenarioSchema),
  promptGuardrails,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { scenario, language } = req.body;
      const data = await getOpsScenarioResponse(scenario, language);
      return res.json({
        status: 'success',
        data
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint for Stadium Status Telemetry
router.get('/stadium/status', (req: Request, res: Response) => {
  // Return dynamically structured telemetry
  return res.json({
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
        wasteBinsAverageFill: 64, // percentage
        recycleRate: 78, // percentage
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
});

export default router;

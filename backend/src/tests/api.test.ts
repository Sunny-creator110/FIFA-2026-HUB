import { describe, it, expect } from 'vitest';
import { querySchema, scenarioSchema } from '../middleware/validation';
import { getFanAssistantResponse, getOpsScenarioResponse } from '../services/geminiService';

describe('Validation Schemas', () => {
  it('should validate correct query inputs', () => {
    const valid = querySchema.safeParse({ query: 'Where is gate 4?', language: 'en' });
    expect(valid.success).toBe(true);
  });

  it('should reject invalid language inputs', () => {
    const invalid = querySchema.safeParse({ query: 'Where is gate 4?', language: 'de' });
    expect(invalid.success).toBe(false);
  });

  it('should reject empty queries', () => {
    const invalid = querySchema.safeParse({ query: '', language: 'en' });
    expect(invalid.success).toBe(false);
  });

  it('should reject overly long queries', () => {
    const longQuery = 'a'.repeat(1001);
    const invalid = querySchema.safeParse({ query: longQuery, language: 'en' });
    expect(invalid.success).toBe(false);
  });
});

describe('GenAI Mock Fallback Service', () => {
  it('should return English response for gate congestion queries', async () => {
    const res = await getFanAssistantResponse('Gate 4 congestion', 'en');
    expect(res.response).toContain('Gate 4 is experiencing high delays');
    expect(res.routeHighlight).toBe('gate_4');
  });

  it('should return Spanish accessibility response', async () => {
    const res = await getFanAssistantResponse('wheelchair access', 'es');
    expect(res.response).toContain('accesibilidad total');
    expect(res.routeHighlight).toBe('accessibility_path');
  });

  it('should generate checklist for gate bottleneck scenario', async () => {
    const res = await getOpsScenarioResponse('Gate 4 bottleneck redirect fans', 'en');
    expect(res.title).toBe('Gate 4 Congestion Mitigation');
    expect(res.severity).toBe('high');
    expect(res.checklist.length).toBeGreaterThan(0);
    expect(res.checklist[0].assignee).toBe('Volunteer Core');
  });
});

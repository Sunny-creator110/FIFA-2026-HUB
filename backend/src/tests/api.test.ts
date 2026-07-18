import { describe, it, expect } from 'vitest';
import { querySchema, scenarioSchema } from '../middleware/validation';
import { getFanAssistantResponse, getOpsScenarioResponse } from '../services/geminiService';

describe('Validation Schemas Unit Tests', () => {
  it('should validate correct fan query inputs in English', () => {
    const valid = querySchema.safeParse({ query: 'Where is gate 4?', language: 'en' });
    expect(valid.success).toBe(true);
  });

  it('should validate correct fan query inputs in Spanish', () => {
    const valid = querySchema.safeParse({ query: '¿Dónde está la entrada 2?', language: 'es' });
    expect(valid.success).toBe(true);
  });

  it('should validate correct fan query inputs in French', () => {
    const valid = querySchema.safeParse({ query: 'Où se trouve la porte 3?', language: 'fr' });
    expect(valid.success).toBe(true);
  });

  it('should reject unsupported language codes', () => {
    const invalid = querySchema.safeParse({ query: 'Where is gate 4?', language: 'de' });
    expect(invalid.success).toBe(false);
  });

  it('should reject empty queries', () => {
    const invalid = querySchema.safeParse({ query: '', language: 'en' });
    expect(invalid.success).toBe(false);
  });

  it('should reject whitespace-only queries', () => {
    const invalid = querySchema.safeParse({ query: '   ', language: 'en' });
    expect(invalid.success).toBe(false);
  });

  it('should reject overly long queries (>1000 chars)', () => {
    const longQuery = 'a'.repeat(1001);
    const invalid = querySchema.safeParse({ query: longQuery, language: 'en' });
    expect(invalid.success).toBe(false);
  });

  it('should validate valid ops scenario inputs', () => {
    const valid = scenarioSchema.safeParse({ scenario: 'Crowd spillover at Gate 4 West entry', language: 'en' });
    expect(valid.success).toBe(true);
  });

  it('should reject empty scenario text', () => {
    const invalid = scenarioSchema.safeParse({ scenario: '', language: 'en' });
    expect(invalid.success).toBe(false);
  });
});

describe('GenAI Mock Fallback Service Unit Tests', () => {
  it('should return English response & gate_4 route for gate congestion queries', async () => {
    const res = await getFanAssistantResponse('Gate 4 congestion', 'en');
    expect(res.response).toContain('Gate 4 is experiencing high delays');
    expect(res.routeHighlight).toBe('gate_4');
    expect(res.crowdStatusAlert).toBeDefined();
  });

  it('should return French response for congestion queries when language is fr', async () => {
    const res = await getFanAssistantResponse('Gate 4 congestion', 'fr');
    expect(res.response.toLowerCase()).toContain('porte 4 est actuellement saturée');
    expect(res.routeHighlight).toBe('gate_4');
  });

  it('should return Spanish accessibility response for wheelchair query', async () => {
    const res = await getFanAssistantResponse('wheelchair access', 'es');
    expect(res.response).toContain('accesibilidad total');
    expect(res.routeHighlight).toBe('accessibility_path');
  });

  it('should return bag policy for prohibited items query', async () => {
    const res = await getFanAssistantResponse('What are prohibited bag sizes?', 'en');
    expect(res.response).toContain('Permitted & Prohibited Items Policy');
    expect(res.routeHighlight).toBe('gate_1');
  });

  it('should return default general info response for unmatched general query', async () => {
    const res = await getFanAssistantResponse('What time is kick off?', 'en');
    expect(res.response).toContain('Welcome to FanPulse 2026 Stadium Hub');
    expect(res.routeHighlight).toBe('default');
  });

  it('should generate high severity checklist for gate bottleneck scenario', async () => {
    const res = await getOpsScenarioResponse('Gate 4 bottleneck redirect fans', 'en');
    expect(res.title).toBe('Gate 4 Congestion Mitigation');
    expect(res.severity).toBe('high');
    expect(res.checklist.length).toBeGreaterThan(0);
    expect(res.checklist[0].assignee).toBe('Volunteer Core');
  });

  it('should generate translated title for Spanish scenario request', async () => {
    const res = await getOpsScenarioResponse('Gate 4 bottleneck', 'es');
    expect(res.title).toBe('Mitigación de Congestión en Puerta 4');
    expect(res.severity).toBe('high');
  });

  it('should return fallback medium severity checklist for general incident scenario', async () => {
    const res = await getOpsScenarioResponse('Minor queue at concession stand B', 'en');
    expect(res.title).toBe('Standard Incident Response Checklist');
    expect(res.severity).toBe('medium');
    expect(res.checklist.length).toBeGreaterThan(0);
  });
});

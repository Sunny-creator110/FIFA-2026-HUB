import { describe, it, expect } from 'vitest';
import { computeCrowdSentiment } from '../engine/sentimentEngine';

describe('Sentiment Engine Unit Tests', () => {
  it('should compute high crowd sentiment for high-scoring goal matches', () => {
    const sentiment = computeCrowdSentiment(2, 1, 34, 0);
    expect(sentiment.score).toBeGreaterThan(80);
    expect(sentiment.label).toBe('Ecstatic');
  });

  it('should penalize crowd sentiment score when active incidents exist', () => {
    const sentimentNormal = computeCrowdSentiment(0, 0, undefined, 0);
    const sentimentWithIncidents = computeCrowdSentiment(0, 0, undefined, 3);
    expect(sentimentWithIncidents.score).toBeLessThan(sentimentNormal.score);
  });
});

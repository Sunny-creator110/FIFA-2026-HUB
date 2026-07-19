export interface SentimentScore {
  score: number;
  label: 'Ecstatic' | 'Excited' | 'Neutral' | 'Tense' | 'Anxious';
  trending: 'up' | 'stable' | 'down';
  factors: string[];
}

export function computeCrowdSentiment(
  scoreA: number,
  scoreB: number,
  recentGoalMinute?: number,
  activeIncidentsCount: number = 0
): SentimentScore {
  let baseScore = 75;
  const factors: string[] = [];

  const totalGoals = scoreA + scoreB;
  if (totalGoals > 0) {
    baseScore += totalGoals * 5;
    factors.push(`${totalGoals} total match goals scored (+${totalGoals * 5} pts)`);
  }

  if (recentGoalMinute && recentGoalMinute >= 30) {
    baseScore += 12;
    factors.push('Recent goal excitement boost (+12 pts)');
  }

  if (activeIncidentsCount > 0) {
    const penalty = activeIncidentsCount * 4;
    baseScore -= penalty;
    factors.push(`Active operational incidents (-${penalty} pts)`);
  }

  const finalScore = Math.min(100, Math.max(0, baseScore));

  let label: SentimentScore['label'] = 'Neutral';
  if (finalScore >= 88) label = 'Ecstatic';
  else if (finalScore >= 74) label = 'Excited';
  else if (finalScore >= 55) label = 'Neutral';
  else if (finalScore >= 40) label = 'Tense';
  else label = 'Anxious';

  return {
    score: finalScore,
    label,
    trending: totalGoals > 2 ? 'up' : 'stable',
    factors
  };
}

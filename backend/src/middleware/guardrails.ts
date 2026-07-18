import { Request, Response, NextFunction } from 'express';

// Simple prompt injection detection patterns
const DANGEROUS_PATTERNS = [
  /ignore\s+(?:previous|all|the)\s+(?:instruction|directive|prompt|rule)/i,
  /you\s+are\s+now\s+a/i,
  /system\s+bypass/i,
  /disable\s+safety/i,
  /override\s+system/i,
  /instead\s+of\s+answering/i,
  /forget\s+your\s+role/i,
  /act\s+as\s+a/i,
  /<script>/i,
  /javascript:/i,
  /sql\s+injection/i,
  /DROP\s+TABLE/i,
  /SELECT\s+\*\s+FROM/i,
  /DELETE\s+FROM/i,
  /INSERT\s+INTO/i
];

export const promptGuardrails = (req: Request, res: Response, next: NextFunction) => {
  const contentToScan: string[] = [];

  if (typeof req.body.query === 'string') {
    contentToScan.push(req.body.query);
  }
  if (typeof req.body.scenario === 'string') {
    contentToScan.push(req.body.scenario);
  }

  for (const content of contentToScan) {
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        return res.status(400).json({
          status: 'error',
          message: 'Security Alert: Prompt Injection or Unsafe Input Pattern Detected.',
          code: 'PROMPT_INJECTION_BLOCKED'
        });
      }
    }
  }

  next();
};

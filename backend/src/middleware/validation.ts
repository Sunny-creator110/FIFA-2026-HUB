import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const querySchema = z.object({
  query: z.string()
    .min(1, { message: 'Query cannot be empty.' })
    .max(1000, { message: 'Query must be less than 1000 characters.' })
    .trim(),
  language: z.enum(['en', 'es', 'fr'], {
    errorMap: () => ({ message: 'Language must be en, es, or fr.' })
  })
});

export const scenarioSchema = z.object({
  scenario: z.string()
    .min(1, { message: 'Scenario cannot be empty.' })
    .max(1000, { message: 'Scenario must be less than 1000 characters.' })
    .trim(),
  language: z.enum(['en', 'es', 'fr'], {
    errorMap: () => ({ message: 'Language must be en, es, or fr.' })
  })
});

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

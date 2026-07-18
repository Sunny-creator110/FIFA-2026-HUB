import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet sets security-related HTTP headers
app.use(helmet());

// CORS configuration to prevent unauthorized origins
app.use(cors({
  origin: '*', // For development. Can be restricted in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Main API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date() });
});

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
});

interface CustomError extends Error {
  status?: number;
}

// Global Error Handler (Sanitizes error leaks to client)
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.message || err);
  
  const isDev = process.env.NODE_ENV === 'development';
  return res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'An unexpected operational error occurred.',
    ...(isDev ? { stack: err.stack } : {})
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[FIFA FanPulse 2026 Server] Running on port ${PORT}`);
});
export default app; // For testing

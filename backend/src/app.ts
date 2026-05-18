import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import authRouter from './routes/auth.routes';
import leadsRouter from './routes/lead.routes';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas/Local
connectDB();

// ==========================================
// 🛡️ Global Middlewares Pipeline
// ==========================================

// 1. CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. HTTP Request Logger (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Production-ready verbose access logging
}

// 3. Request Parsers
app.use(express.json({ limit: '10kb' })); // Body parser (strictly limits input size for DOS protection)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================================
// 🌐 Route Mappings
// ==========================================

// Register Core APIs
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/leads', leadsRouter);

// Baseline Health Check Endpoint (Essential for Render/AWS Deployments)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'GigFlow API is healthy and operational!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 4. Catch Unhandled Routes (404 Error Handler)
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handling Middleware
app.use(globalErrorHandler);

// ==========================================
// 🔌 HTTP Server Boostrap
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`🚀 GigFlow Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., failed DB connection during runtime)
process.on('unhandledRejection', (err: any) => {
  console.error('🔥 UNHANDLED REJECTION! Shutting down server gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down server immediately...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;

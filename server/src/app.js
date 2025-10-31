import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

export async function createApp() {
  await connectDB();

  const app = express();

  // Security middlewares
  app.use(helmet());

  // ✅ Allow CORS for all origins, methods, and headers
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Parse JSON requests
  app.use(express.json());

  // HTTP request logging
  app.use(morgan('dev'));

  // Health check route
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // API routes
  app.use('/api', apiRoutes);

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Error handling middlewares
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

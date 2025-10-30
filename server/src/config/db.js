import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDB() {
  // Connect with recommended options; Mongoose 8 uses stable defaults
  mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb+srv://Node_Practice:frJqxIMkFpyNnZ62@cluster0.xrn1k.mongodb.net/ecom_analytics?retryWrites=true&w=majority');
  logger.info('MongoDB connected');
}

export function disconnectDB() {
  return mongoose.disconnect();
}

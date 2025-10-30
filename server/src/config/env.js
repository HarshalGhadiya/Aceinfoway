import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom_analytics',
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTTL: parseInt(process.env.CACHE_TTL_SECONDS || '60', 10),
};
import { logger } from '../config/logger.js';

export function notFound(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Unhandled error');
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
}

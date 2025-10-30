import { getCache, setCache } from '../config/cache.js';
import { env } from '../config/env.js';

// Cache middleware for GET routes
export function cache(keyBuilder) {
  return async (req, res, next) => {
    const key = keyBuilder(req);
    const hit = getCache(key);
    if (hit) return res.json({ cached: true, ...hit });

    // Monkey patch res.json to store result
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      setCache(key, body, env.cacheTTL);
      return originalJson(body);
    };
    next();
  };
}

import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = await createApp();
app.listen(env.port, () => logger.info(`Server running on http://localhost:${env.port}`));

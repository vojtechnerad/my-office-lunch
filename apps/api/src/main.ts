import { serve } from '@hono/node-server';
import app from './app';
import { env } from './env';
import { createSocketServer } from './lib/create-socket-server';
import { Server } from 'node:http';
import { logger } from './middlewares/logger.middleware';

/*
 * TODOs
 *
 * [ ] Implement custom app.onError()
 */

const loggerInstance = logger();

loggerInstance.info(`Starting service...`);

const server = serve({
  fetch: app.fetch,
  port: env.PORT,
});

createSocketServer(server as Server);

loggerInstance.info(`Service is running on http://localhost:${env.PORT}`);
loggerInstance.info(`Environment is set to: ${env.NODE_ENV}`);
loggerInstance.info(`Log level is set to: ${env.LOG_LEVEL}`);
loggerInstance.info(
  `Docs are available on http://localhost:${env.PORT}/reference`,
);

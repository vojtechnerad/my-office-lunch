import { serve } from '@hono/node-server';
import app from './app';
import { env } from './env';
import { WebSocketServer } from 'ws';

/*
 * TODOs
 *
 * [ ] Implement custom app.onError()
 * [ ] Implement logging middleware
 */

console.log(`🚀 Server běží na http://localhost:${env.PORT}`);
// TODO notify only on development environment
console.log(`Docs are available on http://localhost:${env.PORT}/reference`);

const wss = new WebSocketServer({ noServer: true });
serve({
  fetch: app.fetch,
  port: env.PORT,
  websocket: { server: wss },
});

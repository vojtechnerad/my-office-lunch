import { serve } from '@hono/node-server';
import app from './app';
import { env } from './env';

/*
 * TODOs
 *
 * [ ] Implement custom app.onError()
 * [ ] Implement logging middleware
 */

console.log(`🚀 Server běží na http://localhost:${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

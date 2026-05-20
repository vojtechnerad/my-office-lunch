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
// TODO notify only on development environment
console.log(`Docs are available on http://localhost:${env.PORT}/reference`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

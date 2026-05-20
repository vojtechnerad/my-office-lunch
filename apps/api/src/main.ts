import { serve } from '@hono/node-server';
import app from './app';

// Port můžeš načítat z .env souboru (Nx ho automaticky podporuje)
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`🚀 Server běží na http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

import configureOpenApi from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import index from './routes/index.route';

const app = createApp();

const routes = [index];

configureOpenApi(app);
routes.forEach((route) => {
  app.route('/', route);
});

app.get('/', (c) => {
  return c.text('Hello Hono in Nx Monorepo!');
});

app.notFound((c) => {
  return c.json({ message: `Path ${c.req.path} not found.` }, 404);
});

export default app;

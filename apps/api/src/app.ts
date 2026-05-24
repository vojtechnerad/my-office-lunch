import configureOpenApi from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import index from './routes/index.route';
import restaurants from './routes/restaurants/restaurants.index';
import auth from './routes/auth/auth.index';

const app = createApp();

// app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const routes = [index, restaurants, auth];

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

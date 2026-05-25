import configureOpenApi from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import index from './routes/index.route';
import restaurants from './routes/restaurants/restaurants.index';
import auth from './routes/auth/auth.index';
import groups from './routes/groups/groups.index';
import { authMiddleware } from './middlewares/auth.middleware';
import { cors } from 'hono/cors';

const app = createApp();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

const publicRoutes = [auth];
const protectedRoutes = [index, restaurants, groups];

configureOpenApi(app);

publicRoutes.forEach((route) => {
  app.route('/', route);
});

app.use('*', authMiddleware);

protectedRoutes.forEach((route) => {
  app.route('/', route);
});

app.notFound((c) => {
  return c.json({ message: `Path ${c.req.path} not found.` }, 404);
});

export default app;

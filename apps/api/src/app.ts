import configureOpenApi from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import index from './routes/index.route';
import restaurants from './routes/restaurants/restaurants.index';
import auth from './routes/auth/auth.index';
import groups from './routes/groups/groups.index';
import { authMiddleware } from './middlewares/auth.middleware';
import { cors } from 'hono/cors';
import { HttpStatusCodes } from './helpers/http-status-codes.helper';
import { jsonContent } from './helpers/openapi.helper';
import { createRoute, z } from '@hono/zod-openapi';

const baseApp = createApp();

baseApp.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

configureOpenApi(baseApp);

const appWithRoutes = baseApp;

const protectedAppRoutes = createApp();

protectedAppRoutes.use('*', authMiddleware);

const protectedRoutes = protectedAppRoutes
  .route('/', index)
  .route('/', restaurants)
  .route('/', groups);

const app = appWithRoutes.route('/', auth).route('/', protectedRoutes);

app.notFound((c) => {
  return c.json({ message: `Path ${c.req.path} not found.` }, 404);
});

export default app;

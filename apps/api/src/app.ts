import configureOpenApi from './lib/configure-openapi';
import { createApp } from './lib/create-app';
import index from './routes/index.route';
import restaurants from './routes/restaurants/restaurants.index';
import auth from './routes/auth/auth.index';
import { authMiddleware } from './middlewares/auth.middleware';

const app = createApp();

const publicRoutes = [auth];
const protectedRoutes = [index, restaurants];

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

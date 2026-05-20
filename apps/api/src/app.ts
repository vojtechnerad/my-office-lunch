import createApp from './lib/create-app';

const app = createApp();

app.get('/', (c) => {
  return c.text('Hello Hono in Nx Monorepo!');
});

app.notFound((c) => {
  return c.json({ message: `Path ${c.req.path} not found.` }, 404);
});

export default app;

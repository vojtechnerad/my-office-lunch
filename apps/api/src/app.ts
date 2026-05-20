import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono in Nx Monorepo!');
});

app.notFound((c) => {
  return c.json({ message: `Path ${c.req.path} not found.` }, 404);
});

export default app;

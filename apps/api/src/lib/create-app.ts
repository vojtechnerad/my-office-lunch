import { OpenAPIHono } from '@hono/zod-openapi';

export default function createApp() {
  const app = new OpenAPIHono({ strict: false });
  return app;
}

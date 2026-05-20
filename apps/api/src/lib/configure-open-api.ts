import { OpenAPIHono } from '@hono/zod-openapi';

export default function configureOpenApi(app: OpenAPIHono) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MyOfficeLunch API',
    },
  });
}

import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';

export default function configureOpenApi(app: OpenAPIHono) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MyOfficeLunch API',
    },
  });

  app.get(
    '/reference',
    Scalar({
      url: '/doc',
      // showDeveloperTools: 'never',
      // defaultOpenFirstTag: false,
      title: 'API #1',
      agent: {
        disabled: true,
      },
    }),
  );
}

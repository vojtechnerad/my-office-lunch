import { Scalar } from '@scalar/hono-api-reference';
import { AppOpenAPI } from '../types';

export default function configureOpenApi(app: AppOpenAPI) {
  app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
  });

  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MyOfficeLunch API',
      description: 'API documentation for MyOfficeLunch application',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
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

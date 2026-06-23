import { createRoute, z } from '@hono/zod-openapi';
import { describe, expect, it } from 'vitest';

import { HttpStatusCodes } from '../helpers/http-status-codes.helper';
import configureOpenApi from './configure-openapi';
import { createApp, createRouter } from './create-app';

const validateRoute = createRoute({
  method: 'get',
  path: '/validate',
  request: {
    query: z.object({
      limit: z.coerce.number().min(1),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'Validation succeeded',
    },
  },
});

describe('createApp', () => {
  it('returns 422 JSON from the default validation hook', async () => {
    const app = createRouter().openapi(validateRoute, (c) =>
      c.json({ ok: true }, HttpStatusCodes.OK),
    );

    const response = await app.request('/validate?limit=0');

    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
    });
  });

  it('serves the OpenAPI document with bearer auth configured', async () => {
    const app = createApp();

    configureOpenApi(app);

    const response = await app.request('/doc');
    const json = await response.json();

    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(json).toMatchObject({
      openapi: '3.0.0',
      info: {
        title: 'MyOfficeLunch API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          Bearer: {
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
    });
  });

  it('serves the Scalar API reference UI', async () => {
    const app = createApp();

    configureOpenApi(app);

    const response = await app.request('/reference');
    const html = await response.text();

    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('/doc');
  });
});

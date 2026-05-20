import { createRoute, z } from '@hono/zod-openapi';
import { createRouter } from '../lib/create-app';

const router = createRouter().openapi(
  createRoute({
    method: 'get',
    path: '/test',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
        description: 'Test',
      },
    },
  }),
  (c) => {
    return c.json({
      message: 'Test',
    });
  },
);

export default router;

import { createRoute, z } from '@hono/zod-openapi';
import { createRouter } from '../lib/create-app';
import { jsonContent } from '../helpers/openapi.helper';
import { HttpStatusCodes } from '../helpers/http-status-codes.helper';

const router = createRouter().openapi(
  createRoute({
    method: 'get',
    path: '/test',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string(),
        }),
        'Test',
      ),
    },
  }),
  (c) => {
    return c.json({
      message: 'Test',
    });
  },
);

export default router;

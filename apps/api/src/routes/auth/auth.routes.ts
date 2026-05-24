import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';

export const createUser = createRoute({
  path: '/user',
  method: 'post',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({}), 'Create new user'),
  },
});

export type CreateUserRoute = typeof createUser;

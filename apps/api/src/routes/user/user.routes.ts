import { createRoute } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';
import { ME_RESPONSE_SCHEMA } from 'contracts/user.contracts';
import { ERROR_RESPONSE_SCHEMA } from 'contracts/errors.contracts';

const tags = ['User'];

export const userDetails = createRoute({
  path: '/me',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ME_RESPONSE_SCHEMA, 'User details'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ERROR_RESPONSE_SCHEMA,
      'User not found',
    ),
  },
});

export type UserDetailsRoute = typeof userDetails;

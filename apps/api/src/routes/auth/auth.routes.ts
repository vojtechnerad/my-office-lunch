import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { LOGIN_RESPONSE_SCHEMA } from 'contracts/auth.contracts';
import { ERROR_RESPONSE_SCHEMA } from 'contracts/errors.contracts';
import { jsonContent } from '../../helpers/openapi.helper';

export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.email(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      LOGIN_RESPONSE_SCHEMA,
      'Successful login with JWT token response and user details',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      ERROR_RESPONSE_SCHEMA,
      'Unauthorized response when email or password is invalid',
    ),
  },
});

export const meRoute = createRoute({
  method: 'get',
  path: '/me',
  responses: {
    200: {
      description: 'Current user',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            role: z.string(),
          }),
        },
      },
    },
  },
});

export const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            email: z.email(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      description: 'User created',
    },
  },
});

export type LoginRoute = typeof loginRoute;
export type MeRoute = typeof meRoute;
export type RegisterRoute = typeof registerRoute;

import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';

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
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string(),
          }),
        },
      },
      description: 'JWT token',
    },
    [HttpStatusCodes.UNAUTHORIZED]: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Invalid email or password',
    },
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

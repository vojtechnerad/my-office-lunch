import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import {
  LOGIN_REQUEST_SCHEMA,
  LOGIN_RESPONSE_SCHEMA,
  REGISTER_REQUEST_SCHEMA,
} from 'contracts/auth.contracts';
import { ERROR_RESPONSE_SCHEMA } from 'contracts/errors.contracts';
import { jsonContent } from '../../helpers/openapi.helper';

const tags = ['Auth'];

export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags,
  description: 'Login with email and password to receive a JWT token',
  request: {
    body: {
      ...jsonContent(
        LOGIN_REQUEST_SCHEMA,
        'Login request with email and password',
      ),
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

export const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  tags,
  description: 'Register a new user with name, email, and password',
  request: {
    body: {
      ...jsonContent(
        REGISTER_REQUEST_SCHEMA,
        'Register request with name, email, and password',
      ),
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      description: 'User created',
    },
  },
});

export type LoginRoute = typeof loginRoute;
export type RegisterRoute = typeof registerRoute;

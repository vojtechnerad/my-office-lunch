import { z } from '@hono/zod-openapi';

export const LOGIN_REQUEST_SCHEMA = z.object({
  email: z.email(),
  password: z.string(),
});

export const LOGIN_RESPONSE_SCHEMA = z.object({
  token: z.string(),
  id: z.string(),
  name: z.string(),
});

export const REGISTER_REQUEST_SCHEMA = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email(),
  password: z.string(),
});

export type LoginResponse = z.infer<typeof LOGIN_RESPONSE_SCHEMA>;

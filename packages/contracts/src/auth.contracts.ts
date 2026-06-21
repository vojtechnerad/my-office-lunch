import { z } from '@hono/zod-openapi';

export const LOGIN_RESPONSE_SCHEMA = z.object({
  token: z.string(),
  id: z.string(),
  name: z.string(),
});

export type LoginResponse = z.infer<typeof LOGIN_RESPONSE_SCHEMA>;

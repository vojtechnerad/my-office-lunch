import { z } from '@hono/zod-openapi';

export const ERROR_RESPONSE_SCHEMA = z.object({
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof ERROR_RESPONSE_SCHEMA>;

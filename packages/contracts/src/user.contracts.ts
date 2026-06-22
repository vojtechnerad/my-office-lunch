import { z } from '@hono/zod-openapi';

export const ME_RESPONSE_SCHEMA = z.object({
  id: z.string(),
  role: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
  userGroups: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isAdmin: z.boolean(),
    }),
  ),
});

export type MeResponse = z.infer<typeof ME_RESPONSE_SCHEMA>;

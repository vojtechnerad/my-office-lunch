import { z } from '@hono/zod-openapi';

export const LIST_RESTAURANTS_RESPONSE_SCHEMA = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type ListRestaurantsResponse = z.infer<
  typeof LIST_RESTAURANTS_RESPONSE_SCHEMA
>;

import { z } from '@hono/zod-openapi';

export const GET_GROUP_BY_ID_RESPONSE_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  adminUserId: z.string(),
  favoriteRestaurants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string().nullable(),
      dailyMenuUrl: z.string().nullable(),
    }),
  ),
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

export type GetGroupByIdResponse = z.infer<
  typeof GET_GROUP_BY_ID_RESPONSE_SCHEMA
>;

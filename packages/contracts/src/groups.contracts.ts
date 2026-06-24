import { z } from '@hono/zod-openapi';

export const CREATE_GROUP_REQUEST_SCHEMA = z.object({
  name: z.string(),
});

export const LIST_GROUPS_RESPONSE_SCHEMA = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    adminUserId: z.string(),
  }),
);

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

export const UPDATE_GROUP_PARAMS_SCHEMA = z.object({
  groupId: z.uuid(),
});

export const UPDATE_GROUP_REQUEST_SCHEMA = z.object({
  name: z.string().optional(),
});

export const UPDATE_GROUP_RESPONSE_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  adminUserId: z.string(),
});

export const JOIN_GROUP_REQUEST_SCHEMA = z.object({
  groupId: z.string(),
});

export const JOIN_GROUP_RESPONSE_SCHEMA = z.object({});

export const MY_GROUPS_RESPONSE_SCHEMA = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    adminUserId: z.string(),
  }),
);

export type CreateGroupRequest = z.infer<typeof CREATE_GROUP_REQUEST_SCHEMA>;

export type ListGroupsResponse = z.infer<typeof LIST_GROUPS_RESPONSE_SCHEMA>;

export type UpdateGroupParams = z.infer<typeof UPDATE_GROUP_PARAMS_SCHEMA>;
export type UpdateGroupRequest = z.infer<typeof UPDATE_GROUP_REQUEST_SCHEMA>;
export type UpdateGroupResponse = z.infer<typeof UPDATE_GROUP_RESPONSE_SCHEMA>;

export type JoinGroupRequest = z.infer<typeof JOIN_GROUP_REQUEST_SCHEMA>;
export type JoinGroupResponse = z.infer<typeof JOIN_GROUP_RESPONSE_SCHEMA>;

export type MyGroupsResponse = z.infer<typeof MY_GROUPS_RESPONSE_SCHEMA>;

export type GetGroupByIdResponse = z.infer<
  typeof GET_GROUP_BY_ID_RESPONSE_SCHEMA
>;

import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';
import {
  CREATE_GROUP_REQUEST_SCHEMA,
  GET_GROUP_BY_ID_RESPONSE_SCHEMA,
  JOIN_GROUP_REQUEST_SCHEMA,
  JOIN_GROUP_RESPONSE_SCHEMA,
  LIST_GROUPS_RESPONSE_SCHEMA,
  MY_GROUPS_RESPONSE_SCHEMA,
  UPDATE_GROUP_PARAMS_SCHEMA,
  UPDATE_GROUP_REQUEST_SCHEMA,
  UPDATE_GROUP_RESPONSE_SCHEMA,
} from 'contracts/groups.contracts';
import { ERROR_RESPONSE_SCHEMA } from 'contracts/errors.contracts';

const tags = ['Groups'];

/**
 * Create a new group
 */
export const createGroup = createRoute({
  path: '/groups',
  method: 'post',
  tags,
  request: {
    body: {
      ...jsonContent(CREATE_GROUP_REQUEST_SCHEMA, 'Create group request body'),
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(z.object({}), 'Create new group'),
  },
});

/**
 * List all groups
 */
export const listGroups = createRoute({
  path: '/groups',
  method: 'get',
  tags,
  description: 'List all groups',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      LIST_GROUPS_RESPONSE_SCHEMA,
      'List of groups',
    ),
  },
});

export const getGroupById = createRoute({
  path: '/groups/{groupId}',
  method: 'get',
  tags,
  description: 'Get group by ID',
  request: {
    params: z.object({
      groupId: z.string().uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      GET_GROUP_BY_ID_RESPONSE_SCHEMA,
      'Group details',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Group not found',
    ),
  },
});

export const updateGroup = createRoute({
  path: '/groups/{groupId}',
  method: 'patch',
  tags,
  description: 'Update group details',
  security: [{ bearerAuth: [] }],
  request: {
    params: UPDATE_GROUP_PARAMS_SCHEMA,
    body: {
      ...jsonContent(UPDATE_GROUP_REQUEST_SCHEMA, 'Update group request body'),
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      UPDATE_GROUP_RESPONSE_SCHEMA,
      'Group updated successfully',
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      ERROR_RESPONSE_SCHEMA,
      'User unauthorized to update group',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ERROR_RESPONSE_SCHEMA,
      'Group not found',
    ),
  },
});

export const joinGroup = createRoute({
  path: '/groups/{groupId}/join',
  method: 'post',
  tags,
  description: 'Join a group',
  request: {
    params: JOIN_GROUP_REQUEST_SCHEMA,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      JOIN_GROUP_RESPONSE_SCHEMA,
      'Joined group successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Group not found',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({ message: z.string() }),
      'User is already a member',
    ),
  },
});

export const myGroups = createRoute({
  path: '/groups/my',
  method: 'get',
  tags,
  description: 'Get groups of the current user',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      MY_GROUPS_RESPONSE_SCHEMA,
      'List of user groups',
    ),
  },
});

export const addFavoriteRestaurantToGroup = createRoute({
  path: '/groups/{groupId}/add-favorite-restaurant/{restaurantId}',
  method: 'post',
  tags,
  description: 'Add a favorite restaurant to a group',
  request: {
    params: z.object({
      groupId: z.uuid(),
      restaurantId: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({}),
      'Added favorite restaurant to group successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Group or restaurant not found',
    ),
  },
});

export type CreateGroupRoute = typeof createGroup;
export type ListGroupsRoute = typeof listGroups;
export type GetGroupByIdRoute = typeof getGroupById;
export type UpdateGroupRoute = typeof updateGroup;
export type JoinGroupRoute = typeof joinGroup;
export type MyGroupsRoute = typeof myGroups;
export type AddFavoriteRestaurantToGroupRoute =
  typeof addFavoriteRestaurantToGroup;

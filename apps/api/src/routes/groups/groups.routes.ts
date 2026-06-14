import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';

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
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
          }),
        },
      },
      description: 'Create a new group',
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
    [HttpStatusCodes.OK]: jsonContent(z.array(z.object({})), 'List of groups'),
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
    [HttpStatusCodes.OK]: jsonContent(z.object({}), 'Group details'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
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
    params: z.object({
      groupId: z.uuid(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({}),
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
      z.array(z.object({})),
      'List of user groups',
    ),
  },
});

export type CreateGroupRoute = typeof createGroup;
export type ListGroupsRoute = typeof listGroups;
export type GetGroupByIdRoute = typeof getGroupById;
export type JoinGroupRoute = typeof joinGroup;
export type MyGroupsRoute = typeof myGroups;

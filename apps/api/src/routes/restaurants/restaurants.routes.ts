import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';

const tags = ['Restaurants'];

export const createRestaurant = createRoute({
  path: '/restaurants',
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
      description: 'Create a new restaurant',
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({}), 'Create new restaurant'),
  },
});

export const deleteRestaurant = createRoute({
  path: '/restaurants/{id}',
  method: 'delete',
  tags,
  request: {
    params: z.object({
      id: z.string(),
    }),
    description: 'Delete a restaurant by ID',
    required: true,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Restaurant deleted successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      'Restaurant not found',
    ),
  },
});

export type CreateRestaurantRoute = typeof createRestaurant;
export type DeleteRestaurantRoute = typeof deleteRestaurant;

import { createRoute, z } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { jsonContent } from '../../helpers/openapi.helper';
import {
  CREATE_RESTAURANT_REQUEST_SCHEMA,
  CREATE_RESTAURANT_RESPONSE_SCHEMA,
  LIST_RESTAURANTS_RESPONSE_SCHEMA,
  RESTAURANT_DETAILS_REQUEST_SCHEMA,
  RESTAURANT_DETAILS_RESPONSE_SCHEMA,
} from 'contracts/restaurants.contracts';
import { ERROR_RESPONSE_SCHEMA } from 'contracts/errors.contracts';

const tags = ['Restaurants'];

export const listRestaurants = createRoute({
  path: '/restaurants',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      LIST_RESTAURANTS_RESPONSE_SCHEMA,
      'List of restaurants',
    ),
  },
});

export const restaurantDetails = createRoute({
  path: '/restaurants/{id}',
  method: 'get',
  tags,
  request: {
    params: RESTAURANT_DETAILS_REQUEST_SCHEMA,
    description: 'Get restaurant details by ID',
    required: true,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      RESTAURANT_DETAILS_RESPONSE_SCHEMA,
      'Restaurant details',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      ERROR_RESPONSE_SCHEMA,
      'Restaurant not found',
    ),
  },
});

export const createRestaurant = createRoute({
  path: '/restaurants',
  method: 'post',
  tags,
  request: {
    body: {
      ...jsonContent(
        CREATE_RESTAURANT_REQUEST_SCHEMA,
        'Create a new restaurant',
      ),
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      CREATE_RESTAURANT_RESPONSE_SCHEMA,
      'New restaurant created successfully',
    ),
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
      ERROR_RESPONSE_SCHEMA,
      'Restaurant not found',
    ),
  },
});

export type ListRestaurantsRoute = typeof listRestaurants;
export type RestaurantDetailsRoute = typeof restaurantDetails;
export type CreateRestaurantRoute = typeof createRestaurant;
export type DeleteRestaurantRoute = typeof deleteRestaurant;

import { RouteHandler } from '@hono/zod-openapi';
import {
  CreateRestaurantRoute,
  DeleteRestaurantRoute,
  ListRestaurantsRoute,
  RestaurantDetailsRoute,
} from './restaurants.routes';
import { db, DbSchema } from 'database';
import { eq } from 'drizzle-orm';
import { AppRouteHandler } from '../../types';

export const listRestaurantsHandler: AppRouteHandler<
  ListRestaurantsRoute
> = async (c) => {
  const restaurants = await db
    .select({ id: DbSchema.restaurants.id, name: DbSchema.restaurants.name })
    .from(DbSchema.restaurants);

  return c.json(restaurants);
};

export const restaurantDetailsHandler: AppRouteHandler<
  RestaurantDetailsRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const [restaurant] = await db
    .select()
    .from(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, id))
    .limit(1);

  if (!restaurant) {
    return c.json({ message: `Restaurant with ID ${id} not found` });
  }

  return c.json(restaurant);
};

export const createRestaurantHandler: AppRouteHandler<
  CreateRestaurantRoute
> = async (c) => {
  const restaurant = c.req.valid('json');
  const [inserted] = await db
    .insert(DbSchema.restaurants)
    .values({ name: restaurant.name })
    .returning();
  return c.json(inserted);
};

export const deleteRestaurantHandler: AppRouteHandler<
  DeleteRestaurantRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const [restaurant] = await db
    .select()
    .from(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, id))
    .limit(1);

  if (!restaurant) {
    return c.json({ message: `Restaurant with ID ${id} not found` });
  }

  const [deletedRestaurant] = await db
    .delete(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, id))
    .returning();

  return c.json({
    message: `Restaurant ${deletedRestaurant.name} with ID ${id} deleted successfully`,
  });
};

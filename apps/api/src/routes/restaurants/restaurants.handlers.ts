import {
  CreateRestaurantRoute,
  DeleteRestaurantRoute,
  ListRestaurantsRoute,
  RestaurantDetailsRoute,
} from './restaurants.routes';
import { db, DbSchema } from 'database';
import { eq } from 'drizzle-orm';
import { AppRouteHandler } from '../../types';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';

export const listRestaurantsHandler: AppRouteHandler<
  ListRestaurantsRoute
> = async (c) => {
  const restaurants = await db
    .select({
      id: DbSchema.restaurants.id,
      name: DbSchema.restaurants.name,
      icon: DbSchema.restaurants.icon,
    })
    .from(DbSchema.restaurants);

  const formattedRestaurants = restaurants.map((restaurant) => {
    return {
      id: restaurant.id,
      name: restaurant.name,
      icon: restaurant.icon ?? undefined,
    };
  });

  return c.json(formattedRestaurants, HttpStatusCodes.OK);
};

export const restaurantDetailsHandler: AppRouteHandler<
  RestaurantDetailsRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const [restaurant] = await db
    .select({
      id: DbSchema.restaurants.id,
      name: DbSchema.restaurants.name,
      url: DbSchema.restaurants.url,
      dailyMenuUrl: DbSchema.restaurants.dailyMenuUrl,
      icon: DbSchema.restaurants.icon,
    })
    .from(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, id))
    .limit(1);

  if (!restaurant) {
    return c.json(
      { message: `Restaurant with ID ${id} not found` },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(
    {
      id: restaurant.id,
      name: restaurant.name,
      url: restaurant.url ?? undefined,
      dailyMenuUrl: restaurant.dailyMenuUrl ?? undefined,
      icon: restaurant.icon ?? undefined,
    },
    HttpStatusCodes.OK,
  );
};

export const createRestaurantHandler: AppRouteHandler<
  CreateRestaurantRoute
> = async (c) => {
  const restaurant = c.req.valid('json');
  const [inserted] = await db
    .insert(DbSchema.restaurants)
    .values({
      name: restaurant.name,
      url: restaurant.url,
      dailyMenuUrl: restaurant.dailyMenuUrl,
      icon: restaurant.icon,
    })
    .returning();

  return c.json(
    {
      id: inserted.id,
      name: inserted.name,
      url: inserted.url ?? undefined,
      dailyMenuUrl: inserted.dailyMenuUrl ?? undefined,
      icon: inserted.icon ?? undefined,
    },
    HttpStatusCodes.CREATED,
  );
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

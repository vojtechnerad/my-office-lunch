import { z } from '@hono/zod-openapi';

export const LIST_RESTAURANTS_RESPONSE_SCHEMA = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().optional(),
  }),
);

export const CREATE_RESTAURANT_REQUEST_SCHEMA = z.object({
  name: z.string(),
  url: z.string().optional(),
  dailyMenuUrl: z.string().optional(),
  icon: z.string().optional(),
});

export const CREATE_RESTAURANT_RESPONSE_SCHEMA = z.object({
  name: z.string(),
  url: z.string().optional(),
  dailyMenuUrl: z.string().optional(),
  icon: z.string().optional(),
  id: z.string(),
});

export const RESTAURANT_DETAILS_REQUEST_SCHEMA = z.object({
  id: z.string(),
});

export const RESTAURANT_DETAILS_RESPONSE_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  dailyMenuUrl: z.string().optional(),
  icon: z.string().optional(),
});

export type ListRestaurantsResponse = z.infer<
  typeof LIST_RESTAURANTS_RESPONSE_SCHEMA
>;

export type CreateRestaurantRequest = z.infer<
  typeof CREATE_RESTAURANT_REQUEST_SCHEMA
>;

export type CreateRestaurantResponse = z.infer<
  typeof CREATE_RESTAURANT_RESPONSE_SCHEMA
>;

export type RestaurantDetailsRequest = z.infer<
  typeof RESTAURANT_DETAILS_REQUEST_SCHEMA
>;

export type RestaurantDetailsResponse = z.infer<
  typeof RESTAURANT_DETAILS_RESPONSE_SCHEMA
>;

import { db, DbSchema } from 'database';
import { AppRouteHandler } from '../../types';
import {
  AddFavoriteRestaurantToGroupRoute,
  CreateGroupRoute,
  GetGroupByIdRoute,
  JoinGroupRoute,
  ListGroupsRoute,
  MyGroupsRoute,
} from './groups.routes';
import { and, eq } from 'drizzle-orm';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';

export const createGroupHandler: AppRouteHandler<CreateGroupRoute> = async (
  c,
) => {
  const group = c.req.valid('json');
  const userId = c.var.jwtPayload.sub;
  const [inserted] = await db
    .insert(DbSchema.groups)
    .values({ name: group.name, adminUserId: userId })
    .returning();

  return c.json(inserted);
};

export const listGroupsHandler: AppRouteHandler<ListGroupsRoute> = async (
  c,
) => {
  const groups = await db.select().from(DbSchema.groups);
  return c.json(groups);
};

export const getGroupByIdHandler: AppRouteHandler<GetGroupByIdRoute> = async (
  c,
) => {
  const { groupId } = c.req.valid('param');
  const [group] = await db
    .select()
    .from(DbSchema.groups)
    .where(eq(DbSchema.groups.id, groupId))
    .limit(1);

  if (!group) {
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const favoriteRestaurants = await db
    .select()
    .from(DbSchema.groupsToFavoriteRestaurants)
    .where(eq(DbSchema.groupsToFavoriteRestaurants.groupId, groupId))
    .leftJoin(
      DbSchema.restaurants,
      eq(
        DbSchema.groupsToFavoriteRestaurants.restaurantId,
        DbSchema.restaurants.id,
      ),
    )
    .then((rows) => rows.map((row) => row.restaurants));

  const members = await db
    .select()
    .from(DbSchema.usersToGroups)
    .where(eq(DbSchema.usersToGroups.groupId, groupId))
    .leftJoin(
      DbSchema.users,
      eq(DbSchema.usersToGroups.userId, DbSchema.users.id),
    )
    .then((rows) => rows.map((row) => row.users));

  return c.json({
    ...group,
    favoriteRestaurants: favoriteRestaurants,
    members: members,
  });
};

export const joinGroupHandler: AppRouteHandler<JoinGroupRoute> = async (c) => {
  const { groupId } = c.req.valid('param');
  const userId = c.var.jwtPayload.sub;

  // Check if group exists
  const [group] = await db
    .select()
    .from(DbSchema.groups)
    .where(eq(DbSchema.groups.id, groupId))
    .limit(1);

  if (!group) {
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  // Check if user is already a member
  const [membership] = await db
    .select()
    .from(DbSchema.usersToGroups)
    .where(
      and(
        eq(DbSchema.usersToGroups.groupId, groupId),
        eq(DbSchema.usersToGroups.userId, userId),
      ),
    )
    .limit(1);

  if (membership) {
    return c.json(
      { message: 'User is already a member' },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  // Add user to group
  const [newMembership] = await db
    .insert(DbSchema.usersToGroups)
    .values({ groupId, userId })
    .returning();

  return c.json(newMembership, HttpStatusCodes.OK);
};

export const myGroupsHandler: AppRouteHandler<MyGroupsRoute> = async (c) => {
  const userId = c.var.jwtPayload.sub;

  const membershipsWithGroups = await db
    .select()
    .from(DbSchema.groups)
    .innerJoin(
      DbSchema.usersToGroups,
      eq(DbSchema.usersToGroups.groupId, DbSchema.groups.id),
    )
    .where(eq(DbSchema.usersToGroups.userId, userId));

  const groups = membershipsWithGroups.map((row) => row.groups);

  return c.json(groups, HttpStatusCodes.OK);
};

export const addFavoriteRestaurantToGroupHandler: AppRouteHandler<
  AddFavoriteRestaurantToGroupRoute
> = async (c) => {
  const { groupId, restaurantId } = c.req.valid('param');

  // Check if group exists
  const [group] = await db
    .select()
    .from(DbSchema.groups)
    .where(eq(DbSchema.groups.id, groupId))
    .limit(1);

  if (!group) {
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  console.log(group);

  // Check if restaurant exists
  const [restaurant] = await db
    .select()
    .from(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant) {
    return c.json(
      { message: 'Restaurant not found' },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  console.log(restaurant);

  // Add favorite restaurant to group
  const [newFavorite] = await db
    .insert(DbSchema.groupsToFavoriteRestaurants)
    .values({ groupId, restaurantId })
    .returning();

  return c.json(newFavorite, HttpStatusCodes.OK);
};

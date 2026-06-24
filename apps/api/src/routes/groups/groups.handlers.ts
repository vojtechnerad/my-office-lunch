import { db, DbSchema } from 'database';
import { AppRouteHandler } from '../../types';
import {
  AddFavoriteRestaurantToGroupRoute,
  CreateGroupRoute,
  GetGroupByIdRoute,
  JoinGroupRoute,
  ListGroupsRoute,
  MyGroupsRoute,
  UpdateGroupRoute,
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

  c.var.logger.info(
    `Group created: ${inserted.name} (${inserted.id}) by user ${userId}`,
  );
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const listGroupsHandler: AppRouteHandler<ListGroupsRoute> = async (
  c,
) => {
  const groups = await db.select().from(DbSchema.groups);
  c.var.logger.info(`Retrieved ${groups.length} groups`);
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
    c.var.logger.info(`Group not found: ${groupId}`);
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const favoriteRestaurants = await db
    .select()
    .from(DbSchema.groupsToFavoriteRestaurants)
    .innerJoin(
      DbSchema.restaurants,
      eq(
        DbSchema.groupsToFavoriteRestaurants.restaurantId,
        DbSchema.restaurants.id,
      ),
    )
    .where(eq(DbSchema.groupsToFavoriteRestaurants.groupId, groupId))
    .then((rows) =>
      rows
        .map((row) => row.restaurants)
        .filter(
          (restaurant): restaurant is NonNullable<typeof restaurant> =>
            restaurant?.id !== null,
        ),
    );

  const members = await db
    .select({
      id: DbSchema.users.id,
      name: DbSchema.users.name,
    })
    .from(DbSchema.usersToGroups)
    .innerJoin(
      DbSchema.users,
      eq(DbSchema.usersToGroups.userId, DbSchema.users.id),
    )
    .where(eq(DbSchema.usersToGroups.groupId, groupId));

  c.var.logger.info(
    `Retrieved group: ${group.name} (${group.id}) with ${favoriteRestaurants.length} favorite restaurants and ${members.length} members`,
  );
  return c.json(
    {
      ...group,
      favoriteRestaurants: favoriteRestaurants,
      members: members,
    },
    HttpStatusCodes.OK,
  );
};

export const updateGroupHandler: AppRouteHandler<UpdateGroupRoute> = async (
  c,
) => {
  const { groupId } = c.req.valid('param');
  const { name } = c.req.valid('json');

  const userId = c.var.jwtPayload.sub;

  const [group] = await db
    .select()
    .from(DbSchema.groups)
    .where(eq(DbSchema.groups.id, groupId))
    .limit(1);

  if (!group) {
    c.var.logger.info(`Group not found: ${groupId}`);
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  if (group.adminUserId !== userId) {
    c.var.logger.info(
      `Unauthorized update attempt by user ${userId} on group ${groupId}`,
    );
    return c.json({ message: 'Unauthorized' }, HttpStatusCodes.FORBIDDEN);
  }

  const updateData = {
    ...(name !== undefined ? { name } : {}),
  };

  const [updatedGroup] = await db
    .update(DbSchema.groups)
    .set(updateData)
    .where(eq(DbSchema.groups.id, groupId))
    .returning();

  c.var.logger.info(
    `Group updated: ${updatedGroup.name} (${updatedGroup.id}) by user ${userId}`,
  );
  return c.json(updatedGroup, HttpStatusCodes.OK);
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
    c.var.logger.info(`Group not found: ${groupId}`);
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
    c.var.logger.info(`User ${userId} is already a member of group ${groupId}`);
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

  c.var.logger.info(`User ${userId} joined group ${groupId}`);
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

  c.var.logger.info(`Retrieved ${groups.length} groups for user ${userId}`);
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
    c.var.logger.info(`Group not found: ${groupId}`);
    return c.json({ message: 'Group not found' }, HttpStatusCodes.NOT_FOUND);
  }

  // Check if restaurant exists
  const [restaurant] = await db
    .select()
    .from(DbSchema.restaurants)
    .where(eq(DbSchema.restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant) {
    c.var.logger.info(`Restaurant not found: ${restaurantId}`);
    return c.json(
      { message: 'Restaurant not found' },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Add favorite restaurant to group
  const [newFavorite] = await db
    .insert(DbSchema.groupsToFavoriteRestaurants)
    .values({ groupId, restaurantId })
    .returning();

  c.var.logger.info(
    `Added favorite restaurant ${restaurantId} to group ${groupId}`,
  );
  return c.json(newFavorite, HttpStatusCodes.OK);
};

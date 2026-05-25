import { db, DbSchema } from 'database';
import { AppRouteHandler } from '../../types';
import {
  CreateGroupRoute,
  GetGroupByIdRoute,
  ListGroupsRoute,
} from './groups.routes';
import { eq } from 'drizzle-orm';
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

  return c.json(group);
};

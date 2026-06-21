import { db, DbSchema } from 'database';
import { AppRouteHandler } from '../../types';
import { UserDetailsRoute } from './user.routes';
import { eq } from 'drizzle-orm';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';

export const userDetailsHandler: AppRouteHandler<UserDetailsRoute> = async (
  c,
) => {
  const user = c.get('jwtPayload');
  const userId = user.sub;

  const [userRecord] = await db
    .select({
      id: DbSchema.users.id,
      email: DbSchema.users.email,
      name: DbSchema.users.name,
      createdAt: DbSchema.users.createdAt,
    })
    .from(DbSchema.users)
    .where(eq(DbSchema.users.id, userId))
    .limit(1);

  if (!userRecord) {
    return c.json({ message: 'User not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const userGroupsQuery = await db
    .select({
      groupId: DbSchema.usersToGroups.groupId,
      groupName: DbSchema.groups.name,
      adminUserId: DbSchema.groups.adminUserId,
    })
    .from(DbSchema.usersToGroups)
    .leftJoin(
      DbSchema.groups,
      eq(DbSchema.usersToGroups.groupId, DbSchema.groups.id),
    )
    .where(eq(DbSchema.usersToGroups.userId, userId));

  const userGroups = userGroupsQuery.map((group) => ({
    id: group.groupId,
    name: group.groupName ?? '',
    isAdmin: group.adminUserId === userId,
  }));

  return c.json(
    {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      createdAt: userRecord.createdAt,
      role: user.role,
      userGroups: userGroups,
    },
    HttpStatusCodes.OK,
  );
};

import { db, DbSchema } from 'database';
import { signJwt, verifyJwt } from '../../helpers/jwt.helper';
import bcrypt from 'bcrypt';
import { AppRouteHandler } from '../../types';
import { LoginRoute, RegisterRoute } from './auth.routes';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { and, eq } from 'drizzle-orm';
import { jwtDecrypt } from 'jose';

export const loginHandler: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(DbSchema.users)
    .where(and(eq(DbSchema.users.email, email)))
    .limit(1);

  if (!user) {
    c.var.logger.info(`Failed login attempt for non-existent user: ${email}`);
    return c.json(
      { message: 'Invalid email or password' },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    c.var.logger.info(
      `Failed login attempt for user: ${user.email} (${user.id})`,
    );
    return c.json(
      { message: 'Invalid email or password' },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const token = await signJwt({
    sub: user.id,
    role: 'user',
    name: user.name,
  });

  c.var.logger.info(`User logged in: ${user.email} (${user.id})`);

  return c.json(
    {
      token: token,
      name: user.name,
      id: user.id,
    },
    HttpStatusCodes.OK,
  );
};

export const registerHandler: AppRouteHandler<RegisterRoute> = async (c) => {
  const { email, name, password } = c.req.valid('json');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [createdUser] = await db
    .insert(DbSchema.users)
    .values({
      name,
      passwordHash,
      email,
    })
    .returning();

  if (!createdUser) {
    c.var.logger.error(`Failed to create user: ${email}`);
    return c.json(
      { message: 'User creation failed' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  c.var.logger.info(`User created: ${createdUser.email} (${createdUser.id})`);
  return c.json({ message: 'User created' }, HttpStatusCodes.CREATED);
};

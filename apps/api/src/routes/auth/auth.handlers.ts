import { db, DbSchema } from 'database';
import { signJwt } from '../../helpers/jwt.helper';
import bcrypt from 'bcrypt';
import { AppRouteHandler } from '../../types';
import { LoginRoute, MeRoute, RegisterRoute } from './auth.routes';
import { HttpStatusCodes } from '../../helpers/http-status-codes.helper';
import { and, eq } from 'drizzle-orm';

export const loginHandler: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(DbSchema.users)
    .where(and(eq(DbSchema.users.email, email)))
    .limit(1);

  if (!user) {
    return c.json(
      { message: 'Invalid email or password' },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
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

  return c.json(
    {
      token: token,
      name: user.name,
      id: user.id,
    },
    HttpStatusCodes.OK,
  );
};

export const meHandler: AppRouteHandler<MeRoute> = async (c) => {
  const user = c.get('jwtPayload');

  return c.json({
    id: user.sub,
    role: user.role,
  });
};

export const registerHandler: AppRouteHandler<RegisterRoute> = async (c) => {
  const { email, password } = c.req.valid('json');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [createdUser] = await db
    .insert(DbSchema.users)
    .values({
      name: 'John Doe',
      passwordHash,
      email,
    })
    .returning();

  if (!createdUser) {
    return c.json(
      { message: 'User creation failed' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json({ message: 'User created' }, HttpStatusCodes.CREATED);
};

import { createMiddleware } from 'hono/factory';
import { verifyJwt } from '../helpers/jwt.helper';
import { HttpStatusCodes } from '../helpers/http-status-codes.helper';

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = c.req.header('Authorization');

  if (!auth?.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
  }

  const token = auth.slice(7);

  try {
    const payload = await verifyJwt(token);

    c.set('jwtPayload', payload);

    await next();
  } catch {
    return c.json({ message: 'Invalid token' }, HttpStatusCodes.UNAUTHORIZED);
  }
});

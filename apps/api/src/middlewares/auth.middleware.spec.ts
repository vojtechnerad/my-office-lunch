import { beforeAll, describe, expect, it, vi } from 'vitest';

import { createApp } from '../lib/create-app';

describe('authMiddleware', () => {
  let signJwt: typeof import('../helpers/jwt.helper').signJwt;
  let authMiddleware: typeof import('./auth.middleware').authMiddleware;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'vitest-secret';
    vi.resetModules();

    ({ signJwt } = await import('../helpers/jwt.helper'));
    ({ authMiddleware } = await import('./auth.middleware'));
  });

  it('returns 401 when authorization header is missing', async () => {
    const app = createApp();

    app.use('*', authMiddleware);
    app.get('/protected', (c) => c.json({ ok: true }));

    const response = await app.request('/protected');

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
  });

  it('returns 401 when bearer token is invalid', async () => {
    const app = createApp();

    app.use('*', authMiddleware);
    app.get('/protected', (c) => c.json({ ok: true }));

    const response = await app.request('/protected', {
      headers: {
        Authorization: 'Bearer not-a-valid-token',
      },
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid token',
    });
  });

  it('passes verified JWT payload to downstream handlers', async () => {
    const app = createApp();

    app.use('*', authMiddleware);
    app.get('/protected', (c) =>
      c.json({
        jwtPayload: c.var.jwtPayload,
      }),
    );

    const token = await signJwt({
      name: 'Alice',
      role: 'member',
      sub: 'user-123',
    });

    const response = await app.request('/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      jwtPayload: {
        name: 'Alice',
        role: 'member',
        sub: 'user-123',
      },
    });
  });
});

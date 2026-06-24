import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { JwtPayload } from './jwt.helper';

describe('jwt.helper', () => {
  let signJwt: typeof import('./jwt.helper').signJwt;
  let verifyJwt: typeof import('./jwt.helper').verifyJwt;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'vitest-secret';
    vi.resetModules();

    ({ signJwt, verifyJwt } = await import('./jwt.helper'));
  });

  it('signs and verifies a JWT payload roundtrip', async () => {
    const payload: JwtPayload = {
      name: 'Alice',
      role: 'admin',
      sub: 'user-123',
    };

    const token = await signJwt(payload);
    const verifiedPayload = await verifyJwt(token);

    expect(verifiedPayload).toMatchObject(payload);
  });
});

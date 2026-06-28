import { describe, expect, it, expectTypeOf } from 'vitest';

import { testClient } from 'hono/testing';
import router from './groups.index';
import { createApp } from '../../lib/create-app';
import app from '../../app';

const client = testClient(app);

describe('Groups list', () => {
  it('Unauthorized user unable to access groups list', async () => {
    const response = await client.groups.$get();

    expect(response.status).toBe(401);
  });
});

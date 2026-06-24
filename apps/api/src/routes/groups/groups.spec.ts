import { describe, expect, it, expectTypeOf } from 'vitest';

import { testClient } from 'hono/testing';
import router from './groups.index';
import { createApp } from '../../lib/create-app';

const client = testClient(createApp().route('/', router));

describe('Groups list', () => {
  it('Returns a list of groups', async () => {
    const response = await client.groups.$get();
    const result = await response.json();

    expect(response.status).toBe(200);
    expectTypeOf(result).toBeArray();
  });
});

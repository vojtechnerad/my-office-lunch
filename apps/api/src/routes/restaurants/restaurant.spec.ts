import { describe, it, expectTypeOf } from 'vitest';
import router from './restaurants.index';
import { createApp } from '../../lib/create-app';
import { testClient } from 'hono/testing';
import app from '../../app';

const client = testClient(app);

describe('Restaurants list', () => {
  it('Unauthorized user unable to access restaurants list', async () => {
    const response = await client.restaurants.$get();

    expect(response.status).toBe(401);
  });
});

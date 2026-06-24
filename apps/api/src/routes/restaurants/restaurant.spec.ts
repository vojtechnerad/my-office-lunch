import { describe, it, expectTypeOf } from 'vitest';
import router from './restaurants.index';
import { createApp } from '../../lib/create-app';
import { testClient } from 'hono/testing';

describe('Restaurants list', () => {
  it('Returns a list of restaurants', async () => {
    const client = testClient(createApp().route('/', router));
    const response = await client.restaurants.$get();
    const result = await response.json();

    expect(response.status).toBe(200);
    expectTypeOf(result).toBeArray();
  });
});

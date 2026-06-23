import { describe, it } from 'vitest';
import router from './restaurants.index';

describe('Restaurants list', () => {
  it('Returns a list of restaurants', async () => {
    const response = await router.request('/restaurants');
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toBeInstanceOf(Array);
    console.log(result);
  });
});

import { createRouter } from '../../lib/create-app';
import * as routes from './restaurants.routes';
import * as handlers from './restaurants.handlers';

const router = createRouter()
  .openapi(routes.createRestaurant, handlers.createRestaurantHandler)
  .openapi(routes.deleteRestaurant, handlers.deleteRestaurantHandler);

export default router;

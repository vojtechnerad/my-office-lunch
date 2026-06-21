import { createRouter } from '../../lib/create-app';
import * as routes from './user.routes';
import * as handlers from './user.handlers';

const router = createRouter().openapi(
  routes.userDetails,
  handlers.userDetailsHandler,
);

export default router;

import { createRouter } from '../../lib/create-app';
import * as routes from './auth.routes';
import * as handlers from './auth.handlers';

const router = createRouter()
  .openapi(routes.loginRoute, handlers.loginHandler)
  .openapi(routes.meRoute, handlers.meHandler)
  .openapi(routes.registerRoute, handlers.registerHandler);

export default router;

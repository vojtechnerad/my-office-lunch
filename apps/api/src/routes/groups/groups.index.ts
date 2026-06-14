import { createRouter } from '../../lib/create-app';
import * as routes from './groups.routes';
import * as handlers from './groups.handlers';

const router = createRouter()
  .openapi(routes.listGroups, handlers.listGroupsHandler)
  .openapi(routes.getGroupById, handlers.getGroupByIdHandler)
  .openapi(routes.createGroup, handlers.createGroupHandler)
  .openapi(routes.joinGroup, handlers.joinGroupHandler);

export default router;

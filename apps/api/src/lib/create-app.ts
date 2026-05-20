import { OpenAPIHono } from '@hono/zod-openapi';
import { HttpStatusCodes } from '../helpers/http-status-codes.helper';

export function createRouter() {
  return new OpenAPIHono({
    strict: true,
    defaultHook: (result, c) => {
      if (!result.success) {
        const { success, error } = result;
        return c.json(
          {
            success,
            error,
          },
          HttpStatusCodes.UNPROCESSABLE_ENTITY,
        );
      }
    },
  });
}

export function createApp() {
  const app = createRouter();
  return app;
}

import { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import { JwtPayload } from './helpers/jwt.helper';

export type AppBindings = {
  Variables: {
    jwtPayload: JwtPayload;
  };
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

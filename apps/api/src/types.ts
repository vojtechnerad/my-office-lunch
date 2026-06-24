import { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import { JwtPayload } from './helpers/jwt.helper';
import { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { type HonoLogLayerVariables } from '@loglayer/hono';
import {
  WebSocketClientToServerEvents,
  WebSocketServerToClientEvents,
} from 'contracts/websockets.contracts';

export type AppBindings = {
  Variables: {
    jwtPayload: JwtPayload;
  } & HonoLogLayerVariables;
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type AuthenticatedSocketData = {
  jwtPayload: JwtPayload;
};

export type AppSocket = Socket<
  WebSocketClientToServerEvents,
  WebSocketServerToClientEvents,
  Record<string, never>,
  AuthenticatedSocketData
>;

export type AppSocketServer = SocketIOServer<
  WebSocketClientToServerEvents,
  WebSocketServerToClientEvents,
  Record<string, never>,
  AuthenticatedSocketData
>;

export type SocketServerFactory = (httpServer: HttpServer) => AppSocketServer;

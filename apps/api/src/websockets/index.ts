import { Server } from 'socket.io';
import { AuthenticatedSocketData, SocketServerFactory } from '../types';
import {
  WebSocketClientToServerEvents,
  WebSocketServerToClientEvents,
} from 'contracts/websockets.contracts';
import { socketAuthMiddleware } from './middleware';
import { registerGroupVotingEvents } from './events/group-voting.events';
import { logger } from '../middlewares/logger.middleware';

export const createSocketServer: SocketServerFactory = (httpServer) => {
  const io = new Server<
    WebSocketClientToServerEvents,
    WebSocketServerToClientEvents,
    Record<string, never>,
    AuthenticatedSocketData
  >(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    logger().info(
      `New socket connection: ${socket.id} for user: ${socket.data.jwtPayload.name}`,
    );

    registerGroupVotingEvents(io, socket);

    socket.on('disconnect', (reason) => {
      logger().info(
        `Socket disconnected: ${socket.id} for user: ${socket.data.jwtPayload.name}. Reason: ${reason}`,
      );
    });
  });

  return io;
};

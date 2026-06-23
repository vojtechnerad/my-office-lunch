import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyJwt } from '../helpers/jwt.helper';
import { AppSocket } from '../types';

type SocketMiddlewareNext = (err?: ExtendedError) => void;

export const socketAuthMiddleware = async (
  socket: AppSocket,
  next: SocketMiddlewareNext,
) => {
  const token = socket.handshake.auth.token;

  if (typeof token !== 'string' || token.length === 0) {
    next(new Error('Unauthorized'));
    return;
  }

  try {
    const jwtPayload = await verifyJwt(token);

    socket.data.jwtPayload = jwtPayload;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
};
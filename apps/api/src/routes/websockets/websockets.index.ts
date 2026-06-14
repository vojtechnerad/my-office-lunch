import { WSContext } from 'hono/ws';
import { createRouter } from '../../lib/create-app';
import { upgradeWebSocket } from '@hono/node-server';
import { WebSocket } from 'ws';

const rooms = new Map<string, Set<WSContext<WebSocket>>>();

const router = createRouter().get(
  '/ws/:roomId',
  upgradeWebSocket((c) => {
    const roomId = c.req.param('roomId') ?? '';

    // TODO check db if room for group voting exists
    if (roomId && !rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    return {
      onOpen: (evt, ws) => {
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId)?.add(ws);
        console.log(`Klient připojen do roomky: ${roomId}`);
      },
      onMessage: (evt, ws) => {
        // Broadcast do roomky
        const roomSockets = rooms.get(roomId);
        if (roomSockets) {
          for (const client of roomSockets) {
            client.send(`Data v roomce ${roomId}: ${evt.data}`);
          }
        }
      },
      onClose: (evt, ws) => {
        const roomSockets = rooms.get(roomId);
        if (roomSockets) {
          roomSockets.delete(ws);
          if (roomSockets.size === 0) {
            rooms.delete(roomId);
            console.log(`Roomka ${roomId} smazána.`);
          }
        }
      },
      onError: (evt, ws) => {
        console.log('WebSocket error:', evt);
      },
    };
  }),
);

export default router;

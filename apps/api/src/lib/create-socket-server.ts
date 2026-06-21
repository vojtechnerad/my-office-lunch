import { Server } from 'socket.io';
import { verifyJwt } from '../helpers/jwt.helper';
import { SocketServerFactory } from '../types';
import { db, DbSchema } from 'database';
import { and, between, eq } from 'drizzle-orm';
import { RestaurantVotingResult } from 'contracts/sockets.contracts';

export const createSocketServer: SocketServerFactory = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
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
  });

  io.on('connection', (socket) => {
    console.log(socket.data.jwtPayload);

    socket.on('debug:ping', () => {
      socket.emit('debug:pong', {
        message: 'Socket is connected.',
        tokenPayload: socket.data.jwtPayload,
      });
    });

    socket.on('group:join', async ({ groupId }) => {
      socket.join(`${groupId}`);

      const now = new Date();

      const startOfDayUTC = new Date(now);
      startOfDayUTC.setUTCHours(0, 0, 0, 0);

      const endOfDayUTC = new Date(now);
      endOfDayUTC.setUTCHours(23, 59, 59, 999);

      const currentVotes = await db
        .select({
          restaurantId: DbSchema.groupRestaurantVotes.restaurantId,
          restaurantName: DbSchema.restaurants.name,
          vote: DbSchema.groupRestaurantVotes.vote,
        })
        .from(DbSchema.groupRestaurantVotes)
        .innerJoin(
          DbSchema.restaurants,
          eq(
            DbSchema.groupRestaurantVotes.restaurantId,
            DbSchema.restaurants.id,
          ),
        )
        .where(
          and(
            eq(DbSchema.groupRestaurantVotes.groupId, groupId),
            between(
              DbSchema.groupRestaurantVotes.createdAt,
              startOfDayUTC,
              endOfDayUTC,
            ),
          ),
        );

      const currentVotesArray = Object.values(
        currentVotes.reduce(
          (accumulator, currentVote) => {
            const { restaurantId, vote } = currentVote;

            if (!accumulator[restaurantId]) {
              accumulator[restaurantId] = {
                restaurantId,
                restaurantName: currentVote.restaurantName,
                votes: { preferred: 0, neutral: 0, unwanted: 0 },
              };
            }

            accumulator[restaurantId].votes[vote] += 1;

            return accumulator;
          },
          {} as Record<string, RestaurantVotingResult>,
        ),
      );

      socket.emit('group:joined', { results: currentVotesArray });
    });

    socket.on('vote:change', async ({ groupId, restaurantId, vote }) => {
      console.log(`Vote changed for group ${groupId}:`, { restaurantId, vote });

      const now = new Date();

      const startOfDayUTC = new Date(now);
      startOfDayUTC.setUTCHours(0, 0, 0, 0);

      const endOfDayUTC = new Date(now);
      endOfDayUTC.setUTCHours(23, 59, 59, 999);

      const [existingVote] = await db
        .select()
        .from(DbSchema.groupRestaurantVotes)
        .where(
          and(
            eq(DbSchema.groupRestaurantVotes.groupId, groupId),
            eq(DbSchema.groupRestaurantVotes.restaurantId, restaurantId),
            eq(
              DbSchema.groupRestaurantVotes.userId,
              socket.data.jwtPayload.sub,
            ),
            between(
              DbSchema.groupRestaurantVotes.createdAt,
              startOfDayUTC,
              endOfDayUTC,
            ),
          ),
        )
        .limit(1);

      if (existingVote) {
        await db
          .update(DbSchema.groupRestaurantVotes)
          .set({ vote, createdAt: new Date() })
          .where(eq(DbSchema.groupRestaurantVotes.id, existingVote.id));
      } else {
        await db.insert(DbSchema.groupRestaurantVotes).values({
          groupId,
          restaurantId,
          userId: socket.data.jwtPayload.sub,
          vote,
        });
      }

      const currentVotes = await db
        .select({
          restaurantId: DbSchema.groupRestaurantVotes.restaurantId,
          restaurantName: DbSchema.restaurants.name,
          vote: DbSchema.groupRestaurantVotes.vote,
        })
        .from(DbSchema.groupRestaurantVotes)
        .innerJoin(
          DbSchema.restaurants,
          eq(
            DbSchema.groupRestaurantVotes.restaurantId,
            DbSchema.restaurants.id,
          ),
        )
        .where(
          and(
            eq(DbSchema.groupRestaurantVotes.groupId, groupId),
            between(
              DbSchema.groupRestaurantVotes.createdAt,
              startOfDayUTC,
              endOfDayUTC,
            ),
          ),
        );

      const currentVotesArray = Object.values(
        currentVotes.reduce(
          (accumulator, currentVote) => {
            const { restaurantId, vote } = currentVote;

            if (!accumulator[restaurantId]) {
              accumulator[restaurantId] = {
                restaurantId,
                restaurantName: currentVote.restaurantName,
                votes: { preferred: 0, neutral: 0, unwanted: 0 },
              };
            }

            accumulator[restaurantId].votes[vote] += 1;

            return accumulator;
          },
          {} as Record<string, RestaurantVotingResult>,
        ),
      );

      io.to(`${groupId}`).emit('vote:updated-results', {
        results: currentVotesArray,
      });
    });
  });

  return io;
};

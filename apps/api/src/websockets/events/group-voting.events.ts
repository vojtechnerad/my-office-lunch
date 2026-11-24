import { logger } from '../../middlewares/logger.middleware';
import { AppSocket, AppSocketServer } from '../../types';
import {
  deleteGroupRestaurantVote,
  getCurrentVotingResults,
  getMyVotes,
  isUserMemberOfGroup,
  saveGroupRestaurantVote,
} from '../database-queries';

export const registerGroupVotingEvents = (
  io: AppSocketServer,
  socket: AppSocket,
) => {
  socket.on('group:join', async ({ groupId }) => {
    socket.join(`${groupId}`);

    const results = await getCurrentVotingResults(groupId);
    const myVotes = await getMyVotes({
      groupId,
      userId: socket.data.jwtPayload.sub,
    });

    socket.emit('group:joined', { results, myVotes });
  });

  socket.on('vote:change', async ({ groupId, restaurantId, vote }) => {
    // Verify users membership in the group before allowing them to vote
    const isMember = await isUserMemberOfGroup(
      socket.data.jwtPayload.sub,
      groupId,
    );
    if (!isMember) {
      logger().warn(
        `User ${socket.data.jwtPayload.sub} attempted to vote in group ${groupId} but is not a member.`,
      );
      return;
    }

    logger().info(
      `Vote changed for group ${groupId} by user ${socket.data.jwtPayload.sub}:`,
      restaurantId,
      vote,
    );

    if (vote) {
      await saveGroupRestaurantVote({
        groupId,
        restaurantId,
        userId: socket.data.jwtPayload.sub,
        vote,
      });
    } else {
      await deleteGroupRestaurantVote({
        groupId,
        restaurantId,
        userId: socket.data.jwtPayload.sub,
      });
    }

    const results = await getCurrentVotingResults(groupId);

    io.to(`${groupId}`).emit('vote:updated-results', {
      results,
    });
  });
};

import {
  RestaurantVote,
  RestaurantVotingResult,
} from 'contracts/websockets.contracts';
import { db, DbSchema } from 'database';
import { and, between, eq } from 'drizzle-orm';
import { getUtcDayBounds } from '../helpers/date.helper';

export const getCurrentVotingResults = async (
  groupId: string,
): Promise<RestaurantVotingResult[]> => {
  const { startOfDayUTC, endOfDayUTC } = getUtcDayBounds(new Date());

  const currentVotes = await db
    .select({
      restaurantId: DbSchema.groupRestaurantVotes.restaurantId,
      restaurantName: DbSchema.restaurants.name,
      vote: DbSchema.groupRestaurantVotes.vote,
    })
    .from(DbSchema.groupRestaurantVotes)
    .innerJoin(
      DbSchema.restaurants,
      eq(DbSchema.groupRestaurantVotes.restaurantId, DbSchema.restaurants.id),
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

  return Object.values(
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
};

export const saveGroupRestaurantVote = async ({
  groupId,
  restaurantId,
  userId,
  vote,
}: {
  groupId: string;
  restaurantId: string;
  userId: string;
  vote: RestaurantVote;
}) => {
  const { startOfDayUTC, endOfDayUTC } = getUtcDayBounds(new Date());

  const [existingVote] = await db
    .select()
    .from(DbSchema.groupRestaurantVotes)
    .where(
      and(
        eq(DbSchema.groupRestaurantVotes.groupId, groupId),
        eq(DbSchema.groupRestaurantVotes.restaurantId, restaurantId),
        eq(DbSchema.groupRestaurantVotes.userId, userId),
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

    return;
  }

  await db.insert(DbSchema.groupRestaurantVotes).values({
    groupId,
    restaurantId,
    userId,
    vote,
  });
};

export const deleteGroupRestaurantVote = async ({
  groupId,
  restaurantId,
  userId,
}: {
  groupId: string;
  restaurantId: string;
  userId: string;
}) => {
  const { startOfDayUTC, endOfDayUTC } = getUtcDayBounds(new Date());

  await db
    .delete(DbSchema.groupRestaurantVotes)
    .where(
      and(
        eq(DbSchema.groupRestaurantVotes.groupId, groupId),
        eq(DbSchema.groupRestaurantVotes.restaurantId, restaurantId),
        eq(DbSchema.groupRestaurantVotes.userId, userId),
        between(
          DbSchema.groupRestaurantVotes.createdAt,
          startOfDayUTC,
          endOfDayUTC,
        ),
      ),
    );
};

export const isUserMemberOfGroup = async (
  userId: string,
  groupId: string,
): Promise<boolean> => {
  const [membership] = await db
    .select()
    .from(DbSchema.usersToGroups)
    .where(
      and(
        eq(DbSchema.usersToGroups.groupId, groupId),
        eq(DbSchema.usersToGroups.userId, userId),
      ),
    )
    .limit(1);

  return Boolean(membership);
};

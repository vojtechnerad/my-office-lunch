export type RestaurantVote = 'preferred' | 'neutral' | 'unwanted';

export type RestaurantVotingResult = {
  restaurantId: string;
  restaurantName: string;
  votes: {
    preferred: number;
    neutral: number;
    unwanted: number;
  };
};

export type GroupJoinPayload = {
  groupId: string;
};

export type GroupJoinedPayload = {
  results: RestaurantVotingResult[];
};

export type VoteChangePayload = {
  groupId: string;
  restaurantId: string;
  vote: RestaurantVote | null;
};

export type VoteUpdatedResultsPayload = {
  results: RestaurantVotingResult[];
};

export interface WebSocketClientToServerEvents {
  'group:join': (payload: GroupJoinPayload) => void;
  'vote:change': (payload: VoteChangePayload) => void;
}

export interface WebSocketServerToClientEvents {
  'group:joined': (payload: GroupJoinedPayload) => void;
  'vote:updated-results': (payload: VoteUpdatedResultsPayload) => void;
}

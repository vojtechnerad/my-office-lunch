export type RestaurantVotingResult = {
  restaurantId: string;
  restaurantName: string;
  votes: {
    preferred: number;
    neutral: number;
    unwanted: number;
  };
};

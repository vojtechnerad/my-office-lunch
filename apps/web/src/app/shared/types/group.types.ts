export type GroupDetails = {
  id: string;
  name: string;
  createdAt: string;
  adminUserId: string;
  favoriteRestaurants: Array<{
    id: string;
    name: string;
    url: string | null;
    dailyMenuUrl: string | null;
  }>;
  members: Array<{
    id: string;
    name: string;
  }>;
};

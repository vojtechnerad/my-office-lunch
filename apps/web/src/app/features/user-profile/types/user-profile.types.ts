export type TUserProfile = {
  id: string;
  role: string;
  email: string;
  name: string;
  createdAt: string;
  userGroups: Array<{
    id: string;
    name: string;
    isAdmin: boolean;
  }>;
};

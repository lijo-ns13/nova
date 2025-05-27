export interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
  headline?: string;
}

export interface NetworkUser {
  user: User;
  isFollowing: boolean;
}

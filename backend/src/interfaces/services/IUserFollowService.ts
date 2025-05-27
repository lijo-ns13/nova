import { IUser } from "../../models/user.modal";

export interface IUserFollowService {
  followUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }>;

  unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }>;

  getFollowers(userId: string): Promise<IUser[]>;

  getFollowing(userId: string): Promise<IUser[]>;

  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}

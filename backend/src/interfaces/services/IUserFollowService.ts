import { IUser } from "../../models/user.modal";
import { IUserWithStatus } from "../../repositories/mongo/UserRepository";

export interface IUserFollowService {
  followUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }>;

  unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }>;

  // getFollowers(userId: string): Promise<IUser[]>;
  getFollowers(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]>;
  getFollowing(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  // Add to your IUserFollowService interface
  getNetworkUsers(currentUserId: string): Promise<
    {
      user: IUser;
      isFollowing: boolean;
    }[]
  >;
}

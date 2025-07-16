import {
  FollowResultDTO,
  NetworkUserDTO,
  UserWithStatusDTO,
} from "../../mapping/user/UserFollowMapper";

export interface IUserFollowService {
  followUser(followerId: string, followingId: string): Promise<FollowResultDTO>;

  unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<FollowResultDTO>;

  getFollowers(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]>;

  getFollowing(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]>;

  isFollowing(followerId: string, followingId: string): Promise<boolean>;

  // getNetworkUsers(currentUserId: string): Promise<NetworkUserDTO[]>;
  getNetworkUsers(
    currentUserId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }>;
}

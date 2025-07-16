// src/services/UserFollowService.ts

import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

import { IUserFollowService } from "../../interfaces/services/IUserFollowService";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IUserWithStatus } from "../../repositories/mongo/UserRepository";
import {
  FollowResultDTO,
  NetworkUserDTO,
  UserFollowMapper,
  UserWithStatusDTO,
} from "../../mapping/user/UserFollowMapper";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";

@injectable()
export class UserFollowService implements IUserFollowService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.MediaService) private _mediaService: IMediaService
  ) {}

  async followUser(
    followerId: string,
    followingId: string
  ): Promise<FollowResultDTO> {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }

    const alreadyFollowing = await this.userRepository.isFollowing(
      followerId,
      followingId
    );
    if (alreadyFollowing) {
      throw new Error("You are already following this user");
    }

    const { follower, following } = await this.userRepository.followUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      throw new Error("Failed to follow user");
    }

    const followerUser = await this.userRepository.findById(followerId);
    if (followerUser) {
      await this.notificationService.sendNotification(
        followingId,
        `${followerUser.name} followed you`,
        NotificationType.FOLLOW,
        followerId
      );
    }

    return { message: "Successfully followed user" };
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<FollowResultDTO> {
    if (followerId === followingId) {
      throw new Error("You cannot unfollow yourself");
    }

    const isFollowing = await this.userRepository.isFollowing(
      followerId,
      followingId
    );
    if (!isFollowing) {
      throw new Error("You are not following this user");
    }

    const { follower, following } = await this.userRepository.unfollowUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      throw new Error("Failed to unfollow user");
    }

    return { message: "Successfully unfollowed user" };
  }

  async getFollowers(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]> {
    const followers: IUserWithStatus[] =
      await this.userRepository.getFollowersWithFollowingStatus(
        targetUserId,
        currentUserId
      );
    return followers.map(UserFollowMapper.toUserWithStatusDTO);
  }

  async getFollowing(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]> {
    const following: IUserWithStatus[] =
      await this.userRepository.getFollowingWithFollowingStatus(
        targetUserId,
        currentUserId
      );
    return following.map(UserFollowMapper.toUserWithStatusDTO);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.userRepository.isFollowing(followerId, followingId);
  }
  async getNetworkUsers(
    currentUserId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const [{ users: allUsers, total }, followingUsers] = await Promise.all([
      this.userRepository.getPaginatedUsersExcept(
        currentUserId,
        page,
        limit,
        search
      ),
      this.userRepository.getFollowing(currentUserId),
    ]);

    const followingIds = new Set(followingUsers.map((u) => u._id.toString()));

    const mappedUsers = await Promise.all(
      allUsers.map(async (user) => {
        const signedProfilePic = user.profilePicture
          ? await this._mediaService.getMediaUrl(user.profilePicture)
          : "";

        return UserFollowMapper.toNetworkUserDTO(
          user,
          signedProfilePic,
          followingIds.has(user._id.toString())
        );
      })
    );

    mappedUsers.sort((a, b) =>
      a.isFollowing === b.isFollowing ? 0 : a.isFollowing ? -1 : 1
    );

    return { users: mappedUsers, total };
  }
}

// src/services/UserFollowService.ts

import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

import { IUser } from "../../models/user.modal";
import { IUserFollowService } from "../../interfaces/services/IUserFollowService";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";

@injectable()
export class UserFollowService implements IUserFollowService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async followUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }> {
    if (followerId === followingId) {
      return { success: false, message: "You cannot follow yourself" };
    }

    const isAlreadyFollowing = await this.userRepository.isFollowing(
      followerId,
      followingId
    );
    if (isAlreadyFollowing) {
      return { success: false, message: "You are already following this user" };
    }

    const { follower, following } = await this.userRepository.followUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      return { success: false, message: "Failed to follow user" };
    }
    const userData = await this._userRepo.findById(followerId);
    await this.notificationService.sendNotification(
      followingId,
      `${userData?.name} followed you`,
      NotificationType.FOLLOW,
      followerId.toString()
    );
    return { success: true, message: "Successfully followed user" };
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; message: string }> {
    if (followerId === followingId) {
      return { success: false, message: "You cannot unfollow yourself" };
    }

    const isFollowing = await this.userRepository.isFollowing(
      followerId,
      followingId
    );
    if (!isFollowing) {
      return { success: false, message: "You are not following this user" };
    }

    const { follower, following } = await this.userRepository.unfollowUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      return { success: false, message: "Failed to unfollow user" };
    }

    return { success: true, message: "Successfully unfollowed user" };
  }

  async getFollowers(userId: string): Promise<IUser[]> {
    return this.userRepository.getFollowers(userId);
  }

  async getFollowing(userId: string): Promise<IUser[]> {
    return this.userRepository.getFollowing(userId);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.userRepository.isFollowing(followerId, followingId);
  }
  // Add to your UserFollowService class
  async getNetworkUsers(currentUserId: string): Promise<
    {
      user: IUser;
      isFollowing: boolean;
    }[]
  > {
    // Get all users except the current user
    const allUsers = await this.userRepository.getAllUsersExcept(currentUserId);

    // Get users the current user is following
    const followingUsers = await this.userRepository.getFollowing(
      currentUserId
    );
    const followingIds = new Set(followingUsers.map((u) => u._id.toString()));

    // Create the result array with follow status
    const result = allUsers.map((user) => ({
      user,
      isFollowing: followingIds.has(user._id.toString()),
    }));

    // Sort to show non-followed users first
    result.sort((a, b) => {
      if (a.isFollowing === b.isFollowing) return 0;
      return a.isFollowing ? 1 : -1;
    });

    return result;
  }
}

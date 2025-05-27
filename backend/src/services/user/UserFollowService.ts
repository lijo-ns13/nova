// src/services/UserFollowService.ts

import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

import { IUser } from "../../models/user.modal";
import { IUserFollowService } from "../../interfaces/services/IUserFollowService";

@injectable()
export class UserFollowService implements IUserFollowService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
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
}

// src/controllers/UserFollowController.ts

import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IUserFollowController } from "../../interfaces/controllers/IUserFollowController";
import { IUserFollowService } from "../../interfaces/services/IUserFollowService";
import { TYPES } from "../../di/types";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class UserFollowController implements IUserFollowController {
  constructor(
    @inject(TYPES.UserFollowService)
    private userFollowService: IUserFollowService
  ) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser)?.id;
      const followingId = req.params.userId;

      const result = await this.userFollowService.followUser(
        followerId,
        followingId
      );

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error in followUser:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser)?.id;
      const followingId = req.params.userId;

      const result = await this.userFollowService.unfollowUser(
        followerId,
        followingId
      );

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error in unfollowUser:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const currentUserId = (req.user as AuthenticatedUser)?.id;
      const followers = await this.userFollowService.getFollowers(
        currentUserId,
        userId
      );
      res.status(200).json({ success: true, data: followers });
    } catch (error) {
      console.error("Error in getFollowers:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get followers" });
    }
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const currentUserId = (req.user as AuthenticatedUser)?.id;
      const following = await this.userFollowService.getFollowing(
        currentUserId,
        userId
      );
      res.status(200).json({ success: true, data: following });
    } catch (error) {
      console.error("Error in getFollowing:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get following" });
    }
  }

  async checkFollowStatus(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser)?.id;
      const followingId = req.params.userId;

      const isFollowing = await this.userFollowService.isFollowing(
        followerId,
        followingId
      );
      res.status(200).json({ success: true, isFollowing });
    } catch (error) {
      console.error("Error in checkFollowStatus:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to check follow status" });
    }
  }
  // Add to your UserFollowController class
  async getNetworkUsers(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = (req.user as AuthenticatedUser)?.id;
      const networkUsers = await this.userFollowService.getNetworkUsers(
        currentUserId
      );
      res.status(200).json({ success: true, data: networkUsers });
    } catch (error) {
      console.error("Error in getNetworkUsers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get network users",
      });
    }
  }
}

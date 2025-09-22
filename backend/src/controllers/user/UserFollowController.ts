import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IUserFollowController } from "../../interfaces/controllers/IUserFollowController";
import { IUserFollowService } from "../../interfaces/services/IUserFollowService";
import { TYPES } from "../../di/types";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { UserIdSchema } from "../../core/validations/user/userfollow.validator";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";

@injectable()
export class UserFollowController implements IUserFollowController {
  constructor(
    @inject(TYPES.UserFollowService)
    private readonly _userFollowService: IUserFollowService
  ) {}

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser).id;
      const { userId: followingId } = UserIdSchema.parse(req.params);

      const dto = await this._userFollowService.followUser(
        followerId,
        followingId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: dto.message });
    } catch (error) {
      handleControllerError(error, res, "UserFollowController.followUser");
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser).id;
      const { userId: followingId } = UserIdSchema.parse(req.params);

      const dto = await this._userFollowService.unfollowUser(
        followerId,
        followingId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: dto.message });
    } catch (error) {
      handleControllerError(error, res, "UserFollowController.unfollowUser");
    }
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = (req.user as AuthenticatedUser).id;
      const { userId } = UserIdSchema.parse(req.params);

      const followers = await this._userFollowService.getFollowers(
        userId,
        currentUserId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: followers });
    } catch (error) {
      handleControllerError(error, res, "UserFollowController.getFollowers");
    }
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = (req.user as AuthenticatedUser).id;
      const { userId } = UserIdSchema.parse(req.params);

      const following = await this._userFollowService.getFollowing(
        userId,
        currentUserId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: following });
    } catch (error) {
      handleControllerError(error, res, "UserFollowController.getFollowing");
    }
  }

  async checkFollowStatus(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req.user as AuthenticatedUser).id;
      const { userId: followingId } = UserIdSchema.parse(req.params);

      const isFollowing = await this._userFollowService.isFollowing(
        followerId,
        followingId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, isFollowing });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "UserFollowController.checkFollowStatus"
      );
    }
  }

  async getNetworkUsers(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = (req.user as AuthenticatedUser).id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const { users, total } = await this._userFollowService.getNetworkUsers(
        currentUserId,
        page,
        limit,
        search
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Network users fetched",
        data: {
          users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      handleControllerError(error, res, "UserFollowController.getNetworkUsers");
    }
  }
}

import { injectable, inject } from "inversify";
import { ILikeService } from "../../interfaces/services/Post/ILikeService";
import { ILikeRepository } from "../../interfaces/repositories/ILikeRepository";
import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { INotificationService } from "../../interfaces/services/INotificationService";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private _likeRepo: ILikeRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async likeOrUnlikePost(
    postId: string,
    userId: string
  ): Promise<{ liked: boolean }> {
    const existingLike = await this._likeRepo.findByPostIdAndUserId(
      postId,
      userId
    );

    if (existingLike) {
      await this._likeRepo.deleteByPostIdAndUserId(postId, userId);
      return { liked: false }; // unliked
    } else {
      await this._likeRepo.create({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      });
      await this.notificationService.sendNotification(
        userId,
        `${userId} liked your post`
      );

      return { liked: true }; // liked
    }
  }

  async getLikesForPost(postId: string) {
    return this._likeRepo.findLikesByPostId(postId);
  }
}

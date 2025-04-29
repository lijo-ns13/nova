import { injectable, inject } from "inversify";
import { ILikeService } from "../../../core/interfaces/services/Post/ILikeService";
import { ILikeRepository } from "../../../core/interfaces/repositories/ILikeRepository";
import { TYPES } from "../../../di/types";
import { Types } from "mongoose";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private _likeRepo: ILikeRepository
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
      return { liked: true }; // liked
    }
  }

  async getLikesForPost(postId: string) {
    return this._likeRepo.findLikesByPostId(postId);
  }
}

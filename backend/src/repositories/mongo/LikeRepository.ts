import { inject, injectable } from "inversify";

import { BaseRepository } from "./BaseRepository"; // Import BaseRepository

import { Model, Types } from "mongoose";
import likeModal, { ILike } from "../../models/like.modal";
import { ILikeRepository } from "../../core/interfaces/repositories/ILikeRepository";
import { TYPES } from "../../di/types";

@injectable()
export class LikeRepository
  extends BaseRepository<ILike>
  implements ILikeRepository
{
  constructor(@inject(TYPES.likeModal) likeModal: Model<ILike>) {
    super(likeModal);
  }
  // Custom method: Find like by postId and userId
  async findByPostIdAndUserId(
    postId: string,
    userId: string
  ): Promise<ILike | null> {
    return this.model.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });
  }

  // Custom method: Delete like by postId and userId (Unlike)
  async deleteByPostIdAndUserId(
    postId: string,
    userId: string
  ): Promise<boolean> {
    const result = await this.model.deleteOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount === 1;
  }

  // Custom method: Find all likes for a given postId
  async findLikesByPostId(postId: string): Promise<ILike[]> {
    return this.model.find({ postId: new Types.ObjectId(postId) });
  }
}

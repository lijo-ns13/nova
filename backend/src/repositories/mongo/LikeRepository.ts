import { inject, injectable } from "inversify";

import { BaseRepository } from "./BaseRepository";

import { Model, Types } from "mongoose";
import { ILikeRepository } from "../../interfaces/repositories/ILikeRepository";
import { TYPES } from "../../di/types";
import { ILike, ILikePopulated } from "../entities/like.entity";
import likeModel from "../models/like.model";

@injectable()
export class LikeRepository
  extends BaseRepository<ILike>
  implements ILikeRepository
{
  constructor(@inject(TYPES.likeModel) likeModal: Model<ILike>) {
    super(likeModel);
  }
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
  async findLikesByPostId(postId: string): Promise<ILikePopulated[]> {
    const likes = await this.model
      .find({ postId: new Types.ObjectId(postId) })
      .populate("userId", "name username profilePicture")
      .lean()
      .exec(); // ✅ always call exec for async safety

    return likes as unknown as ILikePopulated[];
  }
}

import { inject, injectable } from "inversify";
import { IPostRepository } from "../../../../core/interfaces/repositories/IPostRepository";
import { BaseRepository } from "./BaseRepository";
import postModal, { IPost } from "../../models/post.modal";
import { TYPES } from "../../../../di/types";
import { Model } from "mongoose";
import { IPostResponse } from "../../../../core/entities/post";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor(@inject(TYPES.postModal) userModal: Model<IPost>) {
    super(postModal);
  }

  async findByCreator(creatorId: string): Promise<IPost[]> {
    return this.model.find({ creatorId });
  }
  async findAllWithMediaAndCreator(
    skip: number,
    limit: number
  ): Promise<IPost[]> {
    return this.model
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .populate("mediaIds")
      .populate("creatorId", "name profilePicture")
      .sort({ createdAt: -1 });
  }
  async totalPosts(): Promise<number> {
    return await this.model.countDocuments({ isDeleted: false });
  }
  async getPost(postId: string): Promise<IPost | null> {
    return await this.model
      .findById(postId)
      .populate("mediaIds")
      .populate("creatorId", "name profilePicture");
  }
}

import { inject, injectable } from "inversify";
import { IPostRepository } from "../../../../core/interfaces/repositories/IPostRepository";
import { BaseRepository } from "./BaseRepository";
import postModal, { IPost } from "../../models/post.modal";
import { TYPES } from "../../../../di/types";
import { Model, Types } from "mongoose";
import { IPostResponse } from "../../../../core/entities/post";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor(@inject(TYPES.postModal) userModal: Model<IPost>) {
    super(postModal);
  }

  async findByCreator(
    skip: number,
    limit: number,
    creatorId: string
  ): Promise<IPost[]> {
    return this.model
      .find({ isDeleted: false, creatorId })
      .skip(skip)
      .limit(limit)
      .populate("mediaIds")
      .populate("creatorId", "name username profilePicture")
      .populate({ path: "Likes" })
      .sort({ createdAt: -1 });
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
      .populate("creatorId", "name username profilePicture")
      .populate({ path: "Likes" })
      .sort({ createdAt: -1 });
  }
  async totalPosts(): Promise<number> {
    return await this.model.countDocuments({ isDeleted: false });
  }
  async getPost(postId: string): Promise<IPost | null> {
    return await this.model
      .findById(postId)
      .populate("mediaIds")
      .populate("creatorId", "name username profilePicture")
      .populate({ path: "Likes" });
  }
}

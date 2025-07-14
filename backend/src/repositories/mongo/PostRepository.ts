import { inject, injectable } from "inversify";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { BaseRepository } from "./BaseRepository";
import postModal, { IPost } from "../../models/post.modal";
import { TYPES } from "../../di/types";
import { Model, Types } from "mongoose";
import { IPostResponse } from "../../core/entities/post";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor(@inject(TYPES.postModal) postModal: Model<IPost>) {
    super(postModal);
  }
  async createPost(
    creatorId: string,
    description: string | undefined,
    mediaIds: string[]
  ): Promise<IPost> {
    const post = await postModal.create({
      creatorId: new Types.ObjectId(creatorId),
      description,
      mediaIds: mediaIds.map((id) => new Types.ObjectId(id)),
    });

    return await post.populate({ path: "Likes" }); // ✅ populate after create
  }
  async updatePost(postId: string, description: string): Promise<IPost | null> {
    const post = await postModal.findByIdAndUpdate(
      postId,
      { description },
      { new: true }
    );

    return post ? await post.populate({ path: "Likes" }) : null; // ✅ populate if found
  }
  async getPostById(postId: string): Promise<IPost | null> {
    return await postModal.findById(postId).populate({ path: "Likes" });
  }

  async getAllPosts(page: number, limit: number): Promise<IPost[]> {
    return await postModal
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: "Likes" });
  }

  async deletePost(postId: string): Promise<void> {
    await postModal.findByIdAndUpdate(postId, { isDeleted: true });
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
      .populate("creatorId", "name username profilePicture headline")
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
  async softDelete(postId: string): Promise<IPost | null> {
    return this.model.findByIdAndUpdate(
      postId,
      { isDeleted: true },
      { new: true }
    );
  }

  async hardDelete(postId: string): Promise<IPost | null> {
    return this.model.findByIdAndDelete(postId);
  }

  async countUserPosts(userId: string): Promise<number> {
    return this.model.countDocuments({
      creatorId: new Types.ObjectId(userId),
      isDeleted: false,
    });
  }

  async findById(postId: string): Promise<IPost | null> {
    return this.model.findById(postId);
  }
  // async createPost(input: {
  //   creatorId: string;
  //   description: string;
  //   mediaIds: string[];
  // }): Promise<IPost> {
  //   return this.model.create({
  //     creatorId: new Types.ObjectId(input.creatorId),
  //     description: input.description,
  //     mediaIds: input.mediaIds.map((id) => new Types.ObjectId(id)),
  //   });
  // }
}

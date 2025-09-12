import { inject, injectable } from "inversify";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import { Model, Types } from "mongoose";
import { IPost } from "../entities/post.entity";
import postModel from "../models/post.model";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor(@inject(TYPES.postModel) postModel: Model<IPost>) {
    super(postModel);
  }
  async createPost(
    creatorId: string,
    description: string | undefined,
    mediaIds: string[]
  ): Promise<IPost> {
    const post = await this.model.create({
      creatorId: new Types.ObjectId(creatorId),
      description,
      mediaIds: mediaIds.map((id) => new Types.ObjectId(id)),
    });

    return await post.populate({ path: "Likes" }); // ✅ populate after create
  }
  async updatePost(postId: string, description: string): Promise<IPost | null> {
    const post = await this.model.findByIdAndUpdate(
      postId,
      { description },
      { new: true }
    );

    return post ? await post.populate({ path: "Likes" }) : null; // ✅ populate if found
  }
  async getPostById(postId: string): Promise<IPost | null> {
    return await this.model.findById(postId).populate({ path: "Likes" });
  }

  async getAllPosts(page: number, limit: number): Promise<IPost[]> {
    return await this.model
      .find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: "Likes" });
  }

  async deletePost(postId: string): Promise<void> {
    await this.model.findByIdAndUpdate(postId, { isDeleted: true });
  }
  async findByCreator(
    skip: number,
    limit: number,
    creatorId: string
  ): Promise<IPost[]> {
    return this.model
      .find({ isDeleted: false, creatorId })
      .select("-__v") // optional: hide internal Mongoose fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("mediaIds") // assuming media is preloaded here, but not used in DTO
      .populate("creatorId", "name username profilePicture")
      .populate("Likes");
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
}

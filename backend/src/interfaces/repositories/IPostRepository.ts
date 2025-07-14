import { Types } from "mongoose";
import { IPost } from "../../models/post.modal";
import { IPostResponse } from "../../core/entities/post";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<IPost> {
  createPost(
    creatorId: string,
    description: string | undefined,
    mediaIds: string[]
  ): Promise<IPost>;

  getPostById(postId: string): Promise<IPost | null>;

  getAllPosts(page: number, limit: number): Promise<IPost[]>;

  deletePost(postId: string): Promise<void>;

  updatePost(postId: string, description: string): Promise<IPost | null>;

  findByCreator(
    skip: number,
    limit: number,
    creatorId: string
  ): Promise<IPost[]>;
  findAllWithMediaAndCreator(skip: number, limit: number): Promise<IPost[]>;
  totalPosts(): Promise<number>;
  getPost(postId: string): Promise<IPost | null>;
  softDelete(postId: string): Promise<IPost | null>;
  hardDelete(postId: string): Promise<IPost | null>;
  countUserPosts(userId: string): Promise<number>;
  findById(postId: string): Promise<IPost | null>;
}

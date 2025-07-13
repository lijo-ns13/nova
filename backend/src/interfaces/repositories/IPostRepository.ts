import { Types } from "mongoose";
import { IPost } from "../../models/post.modal";
import { IPostResponse } from "../../core/entities/post";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<IPost> {
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
  createPost(input: {
    creatorId: string;
    description: string;
    mediaIds: string[];
  }): Promise<IPost>;
}

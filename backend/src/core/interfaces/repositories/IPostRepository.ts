import { Types } from "mongoose";
import { IPost } from "../../../models/post.modal";
import { IPostResponse } from "../../entities/post";
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
}

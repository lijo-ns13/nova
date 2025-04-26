import { IPost } from "../../../infrastructure/database/models/post.modal";
import { IPostResponse } from "../../entities/post";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<IPost> {
  findByCreator(creatorId: string): Promise<IPost[] | null>;
  findAllWithMediaAndCreator(skip: number, limit: number): Promise<IPost[]>;
  totalPosts(): Promise<number>;
  getPost(postId: string): Promise<IPost | null>;
}

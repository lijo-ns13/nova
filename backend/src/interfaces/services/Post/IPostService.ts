import { IPost } from "../../../models/post.modal";
import { Express } from "express";
import {
  IPostServiceResponse,
  IPostServiceResponsePaginated,
} from "../../../core/entities/post";
import { UpdatePostInput } from "../../../core/dtos/user/post/post";
import { PostResponseDTO } from "../../../mapping/user/postmapper";

export interface IPostService {
  createPost(
    creatorId: string,
    description: string,
    mediaFiles: Express.Multer.File[]
  ): Promise<PostResponseDTO>;
  deletePost(postId: string, userId: string): Promise<boolean>;
  updatePostDescription(input: UpdatePostInput): Promise<PostResponseDTO>;
  getPost(postId: string): Promise<IPostServiceResponse>;
  getAllPost(
    page: number,
    limit: number
  ): Promise<IPostServiceResponsePaginated>;

  getUsersPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPostServiceResponsePaginated>;
}

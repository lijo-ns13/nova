import { IPost } from "../../../models/post.modal";
import { Express } from "express";
import {
  IPostServiceResponse,
  IPostServiceResponsePaginated,
} from "../../../core/entities/post";

export interface IPostService {
  createPost(
    creatorId: string,
    description: string,
    mediaFiles: Express.Multer.File[]
  ): Promise<IPost>;
  getPost(postId: string): Promise<IPostServiceResponse>;
  getAllPost(
    page: number,
    limit: number
  ): Promise<IPostServiceResponsePaginated>;
  deletePost(postId: string, userId: string): Promise<IPost | null>;
  getUsersPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPostServiceResponsePaginated>;
}

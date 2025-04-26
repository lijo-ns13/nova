import { IPost } from "../../../../infrastructure/database/models/post.modal";
import { Express } from "express";
import {
  IPostServiceResponse,
  IPostServiceResponsePaginated,
} from "../../../entities/post";

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
}

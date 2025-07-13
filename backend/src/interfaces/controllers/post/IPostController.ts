// core/interfaces/controllers/IPostController.ts

import { Request, Response } from "express";

export interface IPostController {
  createPost(req: Request, res: Response): Promise<void>;
  updatePost(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
  getPost(req: Request, res: Response): Promise<void>;

  getAllPost(req: Request, res: Response): Promise<Response>;
  // You can add more methods here, like:
  // getPostById(req: Request, res: Response): Promise<Response>;

  getUsersPosts(req: Request, res: Response): Promise<void>;
  // **like
  likeOrUnlikePost(req: Request, res: Response): Promise<Response>;
  getLikesForPost(req: Request, res: Response): Promise<Response>;
  // comment
  createComment(req: Request, res: Response): Promise<void>;
  getPostComments(req: Request, res: Response): Promise<void>;
  updateComment(req: Request, res: Response): Promise<void>;
  deleteComment(req: Request, res: Response): Promise<void>;
  toggleLikeComment(req: Request, res: Response): Promise<void>;
}

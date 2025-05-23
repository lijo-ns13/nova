// core/interfaces/controllers/IPostController.ts

import { Request, Response } from "express";

export interface IPostController {
  create(req: Request, res: Response): Promise<Response>;
  getPost(req: Request, res: Response): Promise<Response>;
  getAllPost(req: Request, res: Response): Promise<Response>;
  // You can add more methods here, like:
  // getPostById(req: Request, res: Response): Promise<Response>;
  deletePost(req: Request, res: Response): Promise<void>;
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

// core/interfaces/controllers/IPostController.ts

import { Request, Response } from "express";

export interface IPostController {
  create(req: Request, res: Response): Promise<Response>;
  getPost(req: Request, res: Response): Promise<Response>;
  getAllPost(req: Request, res: Response): Promise<Response>;
  // You can add more methods here, like:
  // getPostById(req: Request, res: Response): Promise<Response>;
  // deletePost(req: Request, res: Response): Promise<Response>;
}

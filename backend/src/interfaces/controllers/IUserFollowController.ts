import { Request, Response } from "express";

export interface IUserFollowController {
  followUser(req: Request, res: Response): Promise<void>;
  unfollowUser(req: Request, res: Response): Promise<void>;
  getFollowers(req: Request, res: Response): Promise<void>;
  getFollowing(req: Request, res: Response): Promise<void>;
  checkFollowStatus(req: Request, res: Response): Promise<void>;
}

import { Request, Response } from "express";

export interface IUserController {
  getUser(req: Request, res: Response): Promise<void>;
}

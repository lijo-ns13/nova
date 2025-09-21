import { Request, Response } from "express";

export interface IMessageController {
  getChatUsers(req: Request, res: Response): Promise<void>;
  getConversation(req: Request, res: Response): Promise<void>;
}

import { Request, Response } from "express";

export interface IMessageController {
  getConversation(req: Request, res: Response): Promise<void>;
}

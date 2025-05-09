import { RequestHandler, Request, Response } from "express";

export interface IAdminUserManagementController {
  blockUser: RequestHandler;
  unblockUser: RequestHandler;
  getUsers(req: Request, res: Response): Promise<void>;
}

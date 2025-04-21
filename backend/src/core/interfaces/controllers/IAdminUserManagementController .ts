import { RequestHandler } from "express";

export interface IAdminUserManagementController {
  blockUser: RequestHandler;
  unblockUser: RequestHandler;
  getUsers: RequestHandler;
}

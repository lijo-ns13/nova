import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";
import { IAdminUserManagementController } from "../../interfaces/controllers/IAdminUserManagementController ";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
export class AdminUserManagementController
  implements IAdminUserManagementController
{
  constructor(
    @inject(TYPES.AdminUserManagementService)
    private adminUserManagementService: IAdminUserManagementService
  ) {}
  blockUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.adminUserManagementService.blockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User blocked successfully",
        data: user,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  // Unblock a user
  unblockUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.adminUserManagementService.unblockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User unblocked successfully",
        data: user,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchQuery = req.query.search as string | undefined;

      const usersData = await this.adminUserManagementService.getUsers(
        page,
        limit,
        searchQuery
      );
      if (!usersData) {
        throw new Error("Service Layor not working");
      }
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: searchQuery
          ? "Search results fetched successfully"
          : "Users fetched successfully",
        data: usersData,
      });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  }
}

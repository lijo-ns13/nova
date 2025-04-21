import { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";
import { IAdminUserManagementController } from "../../../../core/interfaces/controllers/IAdminUserManagementController ";
import { IAdminUserManagementService } from "../../../../core/interfaces/services/IAdminUserManagementService";
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
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
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
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  // Get paginated users
  getUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const usersData = await this.adminUserManagementService.getUsers(
        page,
        limit
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: usersData,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };
}

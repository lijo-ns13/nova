import { Request, Response } from "express";
import { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
export class AdminUserManagementController
  implements IAdminUserManagementController
{
  constructor(
    @inject(TYPES.AdminUserManagementController)
    private adminUserManagementController: IAdminUserManagementController
  ) {}
  blockUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await this.adminUserManagementController.blockUser(userId);

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
      const user = await this.adminUserManagementController.unblockUser(userId);

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

      const usersData = await this.adminUserManagementController.getUsers(
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

import { TYPES } from "../../di/types";
import { inject } from "inversify";
import { Request, RequestHandler, Response } from "express";
import { IAdminUserManagementController } from "../../interfaces/controllers/IAdminUserManagementController ";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import { paginationSchema } from "../../core/validations/admin/admin.company.validation";
import { userIdSchema } from "../../core/validations/admin/admin.user.validation";

export class AdminUserManagementController
  implements IAdminUserManagementController
{
  constructor(
    @inject(TYPES.AdminUserManagementService)
    private adminUserManagementService: IAdminUserManagementService
  ) {}

  blockUser: RequestHandler = async (req, res) => {
    try {
      const { userId } = userIdSchema.parse(req.params);
      const user = await this.adminUserManagementService.blockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User blocked successfully",
        data: user,
      });
    } catch (error) {
      handleControllerError(error, res, "blockUser");
    }
  };

  unblockUser: RequestHandler = async (req, res) => {
    try {
      const { userId } = userIdSchema.parse(req.params);
      const user = await this.adminUserManagementService.unblockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User unblocked successfully",
        data: user,
      });
    } catch (error) {
      handleControllerError(error, res, "unblockUser");
    }
  };

  getUsers: RequestHandler = async (req, res) => {
    try {
      const { page, limit, search } = paginationSchema.parse(req.query);
      const result = await this.adminUserManagementService.getUsers(
        page,
        limit,
        search
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: search
          ? "Search results fetched successfully"
          : "Users fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "getUsers");
    }
  };
}

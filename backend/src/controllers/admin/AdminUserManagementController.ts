import { TYPES } from "../../di/types";
import { inject } from "inversify";
import { Request, RequestHandler, Response } from "express";
import { IAdminUserManagementController } from "../../interfaces/controllers/IAdminUserManagementController ";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import { paginationSchema } from "../../core/validations/admin/admin.company.validation";
import { userIdSchema } from "../../core/validations/admin/admin.user.validation";
import {
  ADMIN_CONTROLLER_ERROR,
  ADMIN_MESSAGES,
} from "../../constants/message.constants";

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
        message: ADMIN_MESSAGES.USER.BLOCKED,
        data: user,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.BLOCK_USER);
    }
  };

  unblockUser: RequestHandler = async (req, res) => {
    try {
      const { userId } = userIdSchema.parse(req.params);
      const user = await this.adminUserManagementService.unblockUser(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.USER.UNBLOCKED,
        data: user,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.UNBLOCK_USER);
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
          ? ADMIN_MESSAGES.USER.FETCH_SEARCHED_USERS
          : ADMIN_MESSAGES.USER.FETCH_USERS,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.FETCH_USERS);
    }
  };
}

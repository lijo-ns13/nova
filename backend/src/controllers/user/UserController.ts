import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserService } from "../../interfaces/services/IUserService";
import { IUserController } from "../../interfaces/controllers/IUserController";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: IUserService
  ) {}

  async getUser(req: Request, res: Response) {
    try {
      const { otherUserId } = req.params;
      console.log("otheruserid", otherUserId);
      if (!otherUserId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "User ID not found",
        });
        return;
      }

      const user = await this._userService.getUserById(otherUserId);
      if (!user) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: user });
    } catch (error) {
      handleControllerError(error, res, "UserController::getUser");
    }
  }
}

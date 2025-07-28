import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminAuthService } from "../../interfaces/services/IAdminAuthService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

import { IAdminAuthController } from "../../interfaces/controllers/IAdminAuthController";
import { Request, Response } from "express";

import { handleControllerError } from "../../utils/errorHandler";
import { AdminSignInRequestSchema } from "../../core/dtos/admin/admin.auth.request.dto";
@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private _authService: IAdminAuthService
  ) {}
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const parsed = AdminSignInRequestSchema.parse(req.body);
      const result = await this._authService.signIn(parsed);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "admin signin successsfully",
        role: "admin",
        user: { name: result.name, email: result.email, id: result.id },
        isVerified: true,
        isBlocked: false,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminAuthController.signIn");
    }
  }
}

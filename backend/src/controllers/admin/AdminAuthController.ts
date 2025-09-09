import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminAuthService } from "../../interfaces/services/IAdminAuthService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

import { IAdminAuthController } from "../../interfaces/controllers/IAdminAuthController";
import { Request, Response } from "express";
import { handleControllerError } from "../../utils/errorHandler";
import { AdminSignInRequestSchema } from "../../core/dtos/admin/admin.auth.request.dto";
import { config } from "../../core/config/config";
import { COOKIE_NAMES } from "../../constants/cookie_names";
import { COMMON_MESSAGES } from "../../constants/message.constants";
import { ROLES } from "../../constants/roles";
@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private _authService: IAdminAuthService
  ) {}
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const parsed = AdminSignInRequestSchema.parse(req.body);
      const result = await this._authService.signIn(parsed);
      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: config.cookieSameSite,
        maxAge: config.refreshTokenMaxAge,
      });
      res.cookie(COOKIE_NAMES.ACCESSS_TOKEN, result.accessToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: config.cookieSameSite,
        maxAge: config.accessTokenMaxAge,
      });
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: COMMON_MESSAGES.SIGNIN(ROLES.ADMIN),
        role: ROLES.ADMIN,
        user: { name: result.name, email: result.email, id: result.id },
        isVerified: true,
        isBlocked: false,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminAuthController.signIn");
    }
  }
}

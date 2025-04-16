import { inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAdminAuthService } from "../../../../core/interfaces/services/IAdminAuthService";
import { IJWTService } from "../../../../core/interfaces/services/IJwtService";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { ZodError } from "zod";
import { IAdminAuthController } from "../../../../core/interfaces/controllers/IAdminAuthController";
import { Request, Response } from "express";
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private authService: IAdminAuthService
  ) {}
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const result = await this.authService.signIn(data);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
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
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }
}

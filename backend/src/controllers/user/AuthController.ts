import { inject } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ZodError } from "zod";
import { TYPES } from "../../di/types";
import {
  signinRequestSchema,
  signupRequestSchema,
} from "../../core/dtos/request/user.request.dto";
import { IAuthController } from "../../interfaces/controllers/IUserAuthController";
import { IUserAuthService } from "../../interfaces/services/IUserAuthService";
import { config } from "../../config/config";
import { COOKIE_NAMES } from "../../constants/cookie_names";
import { COMMON_MESSAGES } from "../../constants/message.constants";
import { ROLES } from "../../constants/roles";
import {
  forgetRequestSchema,
  resendRequestSchema,
  resetRequestSchema,
  verifyRequestSchema,
} from "../../core/dtos/auth";
import { VerifyMapper } from "../../mapping/auth/verify.mapper";
import { ResendMapper } from "../../mapping/auth/resend.mapper";
import { ForgetMapper } from "../../mapping/auth/forget.mapper";
import { ResetMapper } from "../../mapping/auth/reset.mapper";

export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.UserAuthService) private _authService: IUserAuthService
  ) {}
  signUp = async (req: Request, res: Response) => {
    try {
      const userDTO = signupRequestSchema.parse(req.body);
      const tempUser = await this._authService.signUp(userDTO);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, message: "OTP sent to email", tempUser });
    } catch (error) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: (error as Error).message,
          some: "other error",
        });
      }
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const userDTO = signinRequestSchema.parse(req.body);
      const result = await this._authService.signIn(userDTO);
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
        message: COMMON_MESSAGES.SIGNIN(ROLES.USER),
        user: result.user,
        role: ROLES.USER,
        isVerified: result.isVerified,
        isBlocked: result.isBlocked,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: (error as Error).message });
      }
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const parsed = verifyRequestSchema.parse(req.body);
      const entity = VerifyMapper.fromDTO(parsed);
      const result = await this._authService.verifyOTP(
        entity.email,
        entity.otp
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const parsed = resendRequestSchema.parse(req.body);
      const entity = ResendMapper.fromDTO(parsed);
      const result = await this._authService.resendOTP(entity.email);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const parsed = forgetRequestSchema.parse(req.body);
      const entity = ForgetMapper.fromDTO(parsed);
      const result = await this._authService.forgetPassword(entity.email);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password reset token sent",
        token: result.rawToken,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const parsed = resetRequestSchema.parse(req.body);
      const entity = ResetMapper.fromDTO(parsed);
      await this._authService.resetPassword(
        entity.token,
        entity.password,
        entity.confirmPassword
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: (error as Error).message });
    }
  };

  logout = async (_req: Request, res: Response) => {
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
      };

      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieOptions);
      res.clearCookie(COOKIE_NAMES.ACCESSS_TOKEN, cookieOptions);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (error as Error).message });
    }
  };
}

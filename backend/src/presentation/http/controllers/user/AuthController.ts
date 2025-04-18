import { inject } from "inversify";
import { Request, Response } from "express";
import { UserAuthService } from "../../../../infrastructure/services/user/UserAuthService";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { ZodError } from "zod";
import { TYPES } from "../../../../di/types";
import {
  signinRequestSchema,
  signupRequestSchema,
} from "../../../../core/dtos/request/user.request.dto";
import { IAuthController } from "../../../../core/interfaces/controllers/IUserAuthController";
import { IUserAuthService } from "../../../../core/interfaces/services/IUserAuthService";
console.log("✅ AuthController loaded");

export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.UserAuthService) private authService: IUserAuthService
  ) {}
  signUp = async (req: Request, res: Response) => {
    console.log("req.body", req.body);
    try {
      const userDTO = signupRequestSchema.parse(req.body);
      const tempUser = await this.authService.signUp(userDTO);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, message: "OTP sent to email", tempUser });
    } catch (error: any) {
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
          .status(500)
          .json({ success: false, error: error.message, some: "other error" });
      }
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const userDTO = signinRequestSchema.parse(req.body);
      const result = await this.authService.signIn(userDTO);
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
        message: "Sign-in successful",
        user: result.user,
        role: "user",
        isVerified: result.isVerified,
        isBlocked: result.isBlocked,
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
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: error.message });
      }
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOTP(email, otp);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOTP(email);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: result.message });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgetPassword(email);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password reset token sent",
        token: result.rawToken,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password, confirmPassword } = req.body;
      await this.authService.resetPassword(token, password, confirmPassword);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Password reset successful" });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: error.message });
    }
  };
}

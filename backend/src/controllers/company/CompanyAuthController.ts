import { inject } from "inversify";
import { ICompanyAuthController } from "../../interfaces/controllers/ICompanyAuthController";
import { ICompanyAuthService } from "../../interfaces/services/ICompanyAuthService";
import { TYPES } from "../../di/types";
import { signUpCompanyRequestSchema } from "../../core/dtos/company/company.signup.dto";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ZodError } from "zod";
import { signInCompanyRequestSchema } from "../../core/dtos/company/company.signin.dto";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { Request, Response } from "express";
import { handleControllerError } from "../../utils/errorHandler";
export class CompanyAuthController implements ICompanyAuthController {
  constructor(
    @inject(TYPES.CompanyAuthService) private authService: ICompanyAuthService,
    @inject(TYPES.JWTService) private jwtService: IJWTService
  ) {}

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const parsed = signUpCompanyRequestSchema.parse(req.body);
      const result = await this.authService.signUp(parsed);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "OTP sent to email successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.signUp");
    }
  }

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const parsed = signInCompanyRequestSchema.parse(req.body);
      const result = await this.authService.signIn(parsed);

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
        message: "Login successful",
        data: result.company,
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.signIn");
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOTP(email, otp);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "OTP verified successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.verify");
    }
  }

  async resend(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOTP(email);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.resend");
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.forgetPassword(email);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password reset token sent",
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.forgetPassword");
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password, confirmPassword } = req.body;
      await this.authService.resetPassword({
        token,
        password,
        confirmPassword,
      });
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.resetPassword");
    }
  }

  async logout(_: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.logout");
    }
  }
}

import { inject, injectable } from "inversify";
import { ICompanyAuthController } from "../../interfaces/controllers/ICompanyAuthController";
import { ICompanyAuthService } from "../../interfaces/services/ICompanyAuthService";
import { TYPES } from "../../di/types";
import { signUpCompanyRequestSchema } from "../../core/dtos/company/company.signup.dto";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { signInCompanyRequestSchema } from "../../core/dtos/company/company.signin.dto";
import { Request, Response } from "express";
import { handleControllerError } from "../../utils/errorHandler";
import { COOKIE_NAMES } from "../../constants/cookie_names";
import { config } from "../../config/config";
import { COMMON_MESSAGES } from "../../constants/message.constants";
import { ROLES } from "../../constants/roles";
import { SignInCompanyMapper } from "../../mapping/company/auth/SignInCompanyMapper";
import {
  forgetRequestSchema,
  resendRequestSchema,
  resetRequestSchema,
  verifyRequestSchema,
} from "../../core/dtos/auth";
import { ResetMapper } from "../../mapping/auth/reset.mapper";
import { ForgetMapper } from "../../mapping/auth/forget.mapper";
import { ResendMapper } from "../../mapping/auth/resend.mapper";
import { VerifyMapper } from "../../mapping/auth/verify.mapper";
@injectable()
export class CompanyAuthController implements ICompanyAuthController {
  constructor(
    @inject(TYPES.CompanyAuthService)
    private readonly _authService: ICompanyAuthService
  ) {}

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const parsed = signUpCompanyRequestSchema.parse({
        ...req.body,
        businessNumber: parseInt(req.body.businessNumber),
        foundedYear: parseInt(req.body.foundedYear),
      });
      const result = await this._authService.signUp(parsed, files);
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
      const entity = SignInCompanyMapper.fromDTO(parsed);
      const result = await this._authService.signIn(entity);

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
        message: COMMON_MESSAGES.SIGNIN(ROLES.COMPANY),
        data: result.company,
      });
    } catch (error) {
      handleControllerError(error, res, "CompanyAuthController.signIn");
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const parsed = verifyRequestSchema.parse(req.body);
      const entity = VerifyMapper.fromDTO(parsed);
      const result = await this._authService.verifyOTP(
        entity.email,
        entity.otp
      );
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
      const parsed = resendRequestSchema.parse(req.body);
      const entity = ResendMapper.fromDTO(parsed);
      const result = await this._authService.resendOTP(entity.email);
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
      const parsed = forgetRequestSchema.parse(req.body);
      const entity = ForgetMapper.fromDTO(parsed);
      await this._authService.forgetPassword(entity.email);
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
      const parsed = resetRequestSchema.parse(req.body);
      const entity = ResetMapper.fromDTO(parsed);
      await this._authService.resetPassword(entity);
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

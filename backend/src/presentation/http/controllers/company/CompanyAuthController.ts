import { inject } from "inversify";
import { ICompanyAuthController } from "../../../../core/interfaces/controllers/ICompanyAuthController";
import { ICompanyAuthService } from "../../../../core/interfaces/services/ICompanyAuthService";
import { TYPES } from "../../../../di/types";
import { signUpCompanyRequestSchema } from "../../../../core/dtos/company/company.signup.dto";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { ZodError } from "zod";
import { signInCompanyRequestSchema } from "../../../../core/dtos/company/company.signin.dto";
import { IJWTService } from "../../../../core/interfaces/services/IJwtService";
import { Request, Response } from "express";
export class CompanyAuthController implements ICompanyAuthController {
  constructor(
    @inject(TYPES.CompanyAuthService) private authService: ICompanyAuthService,
    @inject(TYPES.JWTService) private jwtService: IJWTService
  ) {}

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const parsed = signUpCompanyRequestSchema.parse(req.body);
      if (!parsed) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "missing fields" });
        return;
      }
      const tempCompany = await this.authService.signUp(parsed);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "otp sent to email successfully",
        tempCompany,
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

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const parsed = signInCompanyRequestSchema.parse(req.body);
      const result = await this.authService.signIn(parsed);
      if (!result) {
        res.status(400).json({ message: "not slfjlsjf" });
        return;
      }
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true, // prevents JS access (important!)
        secure: process.env.NODE_ENV === "production", // send over HTTPS in prod
        sameSite: "lax", // prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie lifetime in ms
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true, // prevents JS access (important!)
        secure: process.env.NODE_ENV === "production", // send over HTTPS in prod
        sameSite: "lax", // prevents CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie lifetime in ms
      });
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        role: "company",
        user: result.company,
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
      }
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOTP(email, otp);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "otp verified successfully",
        company: result.company,
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
      }
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }
  async resend(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.resendOTP(email);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, result: result });
    } catch (error) {
      if (error instanceof ZodError) {
        const errObj: Record<string, string> = {};
        error.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      }
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: error.message });
    }
  }
}

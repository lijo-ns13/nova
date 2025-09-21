// src/controllers/CompanyProfileController.ts
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { ICompanyProfileController } from "../../interfaces/controllers/ICompanyProfileController";
import { TYPES } from "../../di/types";
import { ICompanyProfileService } from "../../interfaces/services/ICompanyProfileService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  ProfileImageSchema,
} from "../../core/dtos/company/company.profile.validation";
import { ZodError } from "zod";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";

// Helper function to format Zod errors
const formatZodError = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message; // Only the first message per field
    }
  });
  return errors;
};

@injectable()
export class CompanyProfileController implements ICompanyProfileController {
  constructor(
    @inject(TYPES.CompanyProfileService)
    private _companyProfileService: ICompanyProfileService
  ) {
    // console.log("companyProfileService:", this.companyProfileService);
  }

  async getCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id; // Assumes auth middleware sets req.user
      const profile = await this._companyProfileService.getCompanyProfile(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: profile });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async getCompanyProfileWithDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      const profile =
        await this._companyProfileService.getCompanyProfileWithDetails(
          companyId
        );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: profile });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async updateCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;

      // Validate request body
      const validatedData = UpdateProfileSchema.parse(req.body);

      const updated = await this._companyProfileService.updateCompanyProfile(
        companyId,
        validatedData
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: updated });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          errors: formatZodError(err),
        });
        return;
      }

      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      const validatedData = ProfileImageSchema.parse(req.body);

      const updated = await this._companyProfileService.updateProfileImage(
        companyId,
        validatedData.imageUrl
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: updated });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          errors: formatZodError(err),
        });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async deleteProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      await this._companyProfileService.deleteProfileImage(companyId);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: "Profile image removed" });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      const validatedData = ChangePasswordSchema.parse(req.body);

      await this._companyProfileService.changePassword(
        companyId,
        validatedData.currentPassword,
        validatedData.newPassword,
        validatedData.confirmPassword
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Password changed successfully" });
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          errors: formatZodError(err),
        });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }
}

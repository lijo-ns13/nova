// src/controllers/CompanyProfileController.ts
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { ICompanyProfileController } from "../../interfaces/controllers/ICompanyProfileController";
import { TYPES } from "../../di/types";
import { ICompanyProfileService } from "../../interfaces/services/ICompanyProfileService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

interface Userr {
  id: string;
  email: string;
  role: string;
}
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  ProfileImageSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type ProfileImageInput,
} from "../../core/dtos/company/company.profile.validation";
import { ZodError } from "zod";

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
    private companyProfileService: ICompanyProfileService
  ) {
    // console.log("companyProfileService:", this.companyProfileService);
  }

  async getCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as Userr)?.id; // Assumes auth middleware sets req.user
      const profile = await this.companyProfileService.getCompanyProfile(
        companyId
      );
      res.status(200).json({ success: true, data: profile });
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
      const companyId = (req.user as Userr)?.id;
      const profile =
        await this.companyProfileService.getCompanyProfileWithDetails(
          companyId
        );
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async updateCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as Userr)?.id;

      // Validate request body
      const validatedData = UpdateProfileSchema.parse(req.body);

      const updated = await this.companyProfileService.updateCompanyProfile(
        companyId,
        validatedData
      );
      res.status(200).json({ success: true, data: updated });
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
      const companyId = (req.user as Userr)?.id;
      const validatedData = ProfileImageSchema.parse(req.body);

      const updated = await this.companyProfileService.updateProfileImage(
        companyId,
        validatedData.imageUrl
      );
      res.status(200).json({ success: true, data: updated });
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
      const companyId = (req.user as Userr)?.id;
      await this.companyProfileService.deleteProfileImage(companyId);
      res.status(200).json({ success: true, message: "Profile image removed" });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as Userr)?.id;
      const validatedData = ChangePasswordSchema.parse(req.body);

      await this.companyProfileService.changePassword(
        companyId,
        validatedData.currentPassword,
        validatedData.newPassword,
        validatedData.confirmPassword
      );
      res
        .status(200)
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

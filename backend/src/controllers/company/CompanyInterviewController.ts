// src/controllers/CompanyProfileController.ts
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { TYPES } from "../../di/types";

import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

interface Userr {
  id: string;
  email: string;
  role: string;
}

import { ZodError } from "zod";
import { ICompanyInterviewController } from "../../interfaces/controllers/ICompanyInterviewController";
import { ICompanyInterviewService } from "../../interfaces/services/ICompanyInterviewService";

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
export class CompanyInterviewController implements ICompanyInterviewController {
  constructor(
    @inject(TYPES.CompanyInterviewService)
    private companyInterviewService: ICompanyInterviewService
  ) {}

  async createInterview(req: Request, res: Response): Promise<void> {
    try {
      const { userId, applicationId, scheduledAt } = req.body;
      const companyId = (req.user as Userr)?.id; // Assumes auth middleware sets req.user
      if (!userId || !applicationId || !scheduledAt) {
        res.status(400).json({
          success: false,
          message: "please provide userid,applicationid,scheuldedat",
        });
        return;
      }
      if (!companyId) {
        res
          .status(400)
          .json({ success: false, message: "companyid not found" });
        return;
      }
      const roomId = uuidv4();
      const interview = await this.companyInterviewService.createInterview(
        companyId,
        userId,
        applicationId,
        scheduledAt,
        roomId
      );
      const io = req.app.get("io");
      io?.to(userId).emit("interview-scheduled", {
        roomId,
        scheduledAt,
        interviewId: interview._id,
      });
      res.status(200).json({ success: true, data: interview });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }
  async getCompanyInterviews(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as Userr)?.id; // Assumes auth middleware sets req.user
      const interviews = await this.companyInterviewService.getComanyInterviews(
        companyId
      );
      res.status(200).json({ success: true, data: interviews });
    } catch (err) {
      console.log("error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (err as Error).message });
    }
  }
  async getApplicantDetails(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      if (!applicationId) {
        res
          .status(400)
          .json({ success: false, message: "applicatinId not found" });
        return;
      }
      const application =
        await this.companyInterviewService.getApplicantDetails(applicationId);
      if (!application) {
        res
          .status(400)
          .json({ success: false, message: "application not found" });
        return;
      }
      res.status(200).json({ success: true, application });
    } catch (error) {
      console.log("error", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  }
}

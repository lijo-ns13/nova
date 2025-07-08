// src/controllers/CompanyProfileController.ts
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { TYPES } from "../../di/types";

import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

interface UserPayload {
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
      const companyId = (req.user as UserPayload)?.id; // Assumes auth middleware sets req.user
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
  // src/controllers/CompanyInterviewController.ts
  async getUpcomingAcceptedInterviews(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const companyId = (req.user as UserPayload)?.id;
      if (!companyId) throw new Error("Company ID not found");

      const interviews =
        await this.companyInterviewService.getUpcomingAcceptedInterviews(
          companyId
        );
      res.status(200).json({ success: true, data: interviews });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
  async proposeReschedule(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { reason, timeSlots } = req.body;
      const companyId = (req.user as UserPayload)?.id;
      console.log("req.body", req.body);
      if (!companyId) {
        res
          .status(400)
          .json({ success: false, message: "Company ID not found" });
        return;
      }

      if (!timeSlots || timeSlots.length !== 3) {
        res.status(400).json({
          success: false,
          message: "Please provide exactly 3 time slots",
        });
        return;
      }

      const now = new Date();
      for (const slot of timeSlots) {
        if (new Date(slot) <= now) {
          res.status(400).json({
            success: false,
            message: "Time slots must be in the future",
          });
          return;
        }
      }

      const interview = await this.companyInterviewService.proposeReschedule(
        companyId,
        applicationId,
        reason,
        timeSlots
      );

      res.status(200).json({ success: true, data: interview });
    } catch (err) {
      console.error("Reschedule error:", err);
      res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
}

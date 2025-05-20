// src/controllers/UserInterviewController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { privateDecrypt } from "crypto";
import { IEmailService } from "../../interfaces/services/IEmailService";
interface Userr {
  id: string;
  email: string;
  role: string;
}
@injectable()
export class UserInterviewController {
  constructor(
    @inject(TYPES.UserInterviewService)
    private userInterviewService: IUserInterviewService,
    @inject(TYPES.EmailService) private emailService: IEmailService
  ) {}

  async updateInterviewStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId, status } = req.params;
      const userId = (req.user as Userr)?.id;
      if (!status || !applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Missing applicationId or status",
        });
        return;
      }

      const updated = await this.userInterviewService.updateStatus(
        applicationId,
        status
      );

      if (!updated) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Application not found or update failed",
        });
        return;
      }
      if (status === "interview_accepted_by_user") {
        const interview = await this.userInterviewService.findInterview(
          applicationId,
          userId
        );

        if (!interview) {
          res
            .status(400)
            .json({ success: false, message: "Interview not found" });
          return;
        }

        const { roomId, scheduledAt } = interview;
        const email = (req.user as Userr)?.email;

        if (roomId && email && scheduledAt) {
          await this.emailService.sendInterviewLink(
            email,
            roomId,
            new Date(scheduledAt)
          );
        }
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Interview status updated",
        data: updated,
      });
    } catch (err) {
      console.error("UserInterviewController Error:", err);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}

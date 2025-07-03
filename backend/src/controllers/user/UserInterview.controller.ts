// src/controllers/UserInterviewController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { privateDecrypt } from "crypto";
import { IEmailService } from "../../interfaces/services/IEmailService";
import { ApplicationStatus } from "../../models/application.modal";
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
      const email = (req.user as Userr)?.email;
      if (!status || !applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Missing applicationId or status",
        });
        return;
      }

      const updated = await this.userInterviewService.updateStatus(
        applicationId,
        status,
        email
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
  // In UserInterviewController.ts

  async updateInterviewStatusRescheduled(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      const userId = (req.user as Userr)?.id;
      const email = (req.user as Userr)?.email;

      if (!status || !applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Missing applicationId or status",
        });
        return;
      }

      // Handle reschedule responses differently
      if (
        status === "interview_reschedule_accepted" ||
        status === "interview_reschedule_rejected"
      ) {
        const { selectedSlot } = req.body;

        if (status === "interview_reschedule_accepted" && !selectedSlot) {
          res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Selected slot is required when accepting reschedule",
          });
          return;
        }

        const updated =
          await this.userInterviewService.handleRescheduleResponse(
            applicationId,
            status as ApplicationStatus,
            selectedSlot,
            email
          );

        res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: "Reschedule response processed",
          data: updated,
        });
        return;
      }

      // Original logic for other statuses
      const updated = await this.userInterviewService.updateStatus(
        applicationId,
        status as ApplicationStatus,
        email
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
          res.status(400).json({
            success: false,
            message: "Interview not found",
          });
          return;
        }

        const { roomId, scheduledAt } = interview;

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
  async getRescheduleSlots(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const userId = (req.user as Userr)?.id;

      if (!applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Missing applicationId",
        });
        return;
      }

      const slots = await this.userInterviewService.getRescheduleProposedSlots(
        applicationId,
        userId
      );

      if (!slots) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "No reschedule slots found for this application",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Reschedule slots retrieved successfully",
        data: slots,
      });
    } catch (err) {
      console.error("Error fetching reschedule slots:", err);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}

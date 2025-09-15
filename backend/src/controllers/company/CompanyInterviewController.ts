import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

import { ICompanyInterviewController } from "../../interfaces/controllers/ICompanyInterviewController";
import { ICompanyInterviewService } from "../../interfaces/services/ICompanyInterviewService";
import { handleControllerError } from "../../utils/errorHandler";
import {
  CreateInterviewInput,
  ProposeRescheduleInput,
} from "../../core/dtos/company/interview.dto";
import {
  createInterviewSchema,
  proposeRescheduleSchema,
} from "../../core/validations/company/interview.schema";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class CompanyInterviewController implements ICompanyInterviewController {
  constructor(
    @inject(TYPES.CompanyInterviewService)
    private _interviewService: ICompanyInterviewService
  ) {}

  async createInterview(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createInterviewSchema.parse(req.body);
      const companyId = (req.user as UserPayload)?.id;

      if (!companyId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Unauthorized: companyId not found in request",
        });
        return;
      }
      
      const input: CreateInterviewInput = {
        companyId,
        userId: parsed.userId,
        applicationId: parsed.applicationId,
        jobId: parsed.jobId,
        scheduledAt: parsed.scheduledAt,
      };

      const interviewDTO = await this._interviewService.createInterview(input);

      // Emit real-time event to candidate
      // req.app.get("io")?.to(input.userId).emit("interview-scheduled", {
      //   roomId: input.roomId,
      //   scheduledAt: input.scheduledAt,
      //   interviewId: interviewDTO.id,
      // });

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Interview created successfully",
        data: interviewDTO,
      });
    } catch (err) {
      handleControllerError(
        err,
        res,
        "CompanyInterviewController.createInterview"
      );
    }
  }

  async getUpcomingAcceptedInterviews(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const companyId = (req.user as UserPayload)?.id;

      if (!companyId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Unauthorized: companyId not found in request",
        });
        return;
      }

      const result = await this._interviewService.getUpcomingAcceptedInterviews(
        companyId
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Fetched upcoming interviews successfully",
        data: result,
      });
    } catch (err) {
      handleControllerError(
        err,
        res,
        "CompanyInterviewController.getUpcomingAcceptedInterviews"
      );
    }
  }

  async proposeReschedule(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req.user as UserPayload)?.id;
      const applicationId = req.params.applicationId;
      const parsed = proposeRescheduleSchema.parse(req.body);

      if (!companyId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Unauthorized: companyId not found in request",
        });
        return;
      }

      const input: ProposeRescheduleInput = {
        companyId,
        applicationId,
        jobId: parsed.jobId,
        reason: parsed.reason,
        timeSlots: parsed.timeSlots,
      };

      const updatedInterview = await this._interviewService.proposeReschedule(
        input
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Interview reschedule proposed successfully",
        data: updatedInterview,
      });
    } catch (err) {
      handleControllerError(
        err,
        res,
        "CompanyInterviewController.proposeReschedule"
      );
    }
  }
}

// src/controllers/UserInterviewController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { UserPayload } from "../../constants/userPayload";
import { ApplicationStatus } from "../../models/application.modal";
import { handleControllerError } from "../../utils/errorHandler";
import {
  UpdateInterviewStatusParamsSchema,
  UpdateInterviewStatusRescheduledSchema,
  UpdateInterviewStatusRescheduleParamsSchema,
} from "../../core/validations/user/userinterview.schema";
import { USER_MESSAGES } from "../../constants/message.constants";

@injectable()
export class UserInterviewController {
  constructor(
    @inject(TYPES.UserInterviewService)
    private userInterviewService: IUserInterviewService
  ) {}

  async updateInterviewStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId, status } = UpdateInterviewStatusParamsSchema.parse(
        req.params
      );
      const user = req.user as UserPayload;

      const updated = await this.userInterviewService.updateStatus(
        applicationId,
        status as ApplicationStatus,
        user.email
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.USER_INTERVIEW.SUCCESS.UPDATED,
        data: updated,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.USER_INTERVIEW.ERROR.UPDATE_FAILED
      );
    }
  }

  async updateInterviewStatusRescheduled(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { applicationId, status, selectedSlot } =
        UpdateInterviewStatusRescheduledSchema.parse({
          ...req.params,
          ...req.body,
        });

      const user = req.user as UserPayload;

      const updated = await this.userInterviewService.handleRescheduleResponse(
        applicationId,
        status,
        selectedSlot,
        user.email
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.USER_INTERVIEW.SUCCESS.RESCHEDULED,
        data: updated,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.USER_INTERVIEW.ERROR.RESCHEDULE_FAILED
      );
    }
  }

  async getRescheduleSlots(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } =
        UpdateInterviewStatusRescheduleParamsSchema.parse(req.params);
      const user = req.user as UserPayload;

      const slots = await this.userInterviewService.getRescheduleProposedSlots(
        applicationId,
        user.id
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.USER_INTERVIEW.SUCCESS.GET_RESCHEDULED_SLOTS,
        data: slots,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.USER_INTERVIEW.ERROR.FETCH_SLOTS_FAILED
      );
    }
  }
}

import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";

import { handleControllerError } from "../../utils/errorHandler";
import {
  UpdateInterviewStatusParamsSchema,
  UpdateInterviewStatusRescheduledSchema,
  UpdateInterviewStatusRescheduleParamsSchema,
} from "../../core/validations/user/userinterview.schema";
import { USER_MESSAGES } from "../../constants/message.constants";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";

@injectable()
export class UserInterviewController {
  constructor(
    @inject(TYPES.UserInterviewService)
    private _userInterviewService: IUserInterviewService
  ) {}

  async updateInterviewStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId, status } = UpdateInterviewStatusParamsSchema.parse(
        req.params
      );
      const user = req.user as AuthenticatedUser;

      const updated = await this._userInterviewService.updateStatus(
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

      const user = req.user as AuthenticatedUser;

      const updated = await this._userInterviewService.handleRescheduleResponse(
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
      const user = req.user as AuthenticatedUser;

      const slots = await this._userInterviewService.getRescheduleProposedSlots(
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

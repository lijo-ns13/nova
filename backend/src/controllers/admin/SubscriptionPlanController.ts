import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanController } from "../../interfaces/controllers/ISubscriptionPlanController";
import { ISubscriptionPlanService } from "../../interfaces/services/ISubscriptionPlanService";
import {
  SubscriptionPlanCreateSchema,
  SubscriptionPlanUpdateSchema,
} from "../../core/dtos/admin/subscription.dto";
import { IdSchema } from "../../core/validations/id.schema";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import { transactionFilterSchema } from "../../core/dtos/admin/admin.sub.dto";
import { SubscriptionPlanService } from "../../services/admin/SubscriptionPlanService";
import {
  ADMIN_CONTROLLER_ERROR,
  ADMIN_MESSAGES,
} from "../../constants/message.constants";

@injectable()
export class SubscriptionPlanController implements ISubscriptionPlanController {
  constructor(
    @inject(TYPES.SubscriptionPlanService)
    private subscriptionPlanService: ISubscriptionPlanService
  ) {}
  async getFilteredTransactions(req: Request, res: Response): Promise<void> {
    try {
      const filter = transactionFilterSchema.parse(req.query);
      const result = await this.subscriptionPlanService.getFilteredTransactions(
        filter
      );
      res.status(200).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.FETCH_FILTERED_TRANSACTIONS,
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.SUB.FETCH_FILTERED
      );
    }
  }
  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const parsed = SubscriptionPlanCreateSchema.parse(req.body);
      const result = await this.subscriptionPlanService.createPlan(parsed);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.CREATED,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.SUB.CREATE);
    }
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const parsed = SubscriptionPlanUpdateSchema.parse(req.body);
      const result = await this.subscriptionPlanService.updatePlan(id, parsed);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.UPDATED,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.SUB.UPDATE);
    }
  }

  async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      await this.subscriptionPlanService.deletePlan(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.DELETED,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.SUB.DELETE);
    }
  }

  async getAllPlans(_: Request, res: Response): Promise<void> {
    try {
      const result = await this.subscriptionPlanService.getAllPlans();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.FETCH_ALL,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.SUB.FETCH_ALL);
    }
  }

  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const result = await this.subscriptionPlanService.getPlanById(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.FETCH_ONE,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.SUB.FETCH_ONE);
    }
  }

  async togglePlanStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const { isActive } = req.body;
      const result = await this.subscriptionPlanService.togglePlanStatus(
        id,
        isActive
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SUBSCRIPTION.TOGGLE_STATUS,
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.SUB.TOGGLE_STATUS
      );
    }
  }
}

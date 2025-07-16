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
      res
        .status(200)
        .json({ success: true, message: "Transactions fetched", data: result });
    } catch (error) {
      handleControllerError(error, res, "getFilteredTransactions");
    }
  }
  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const parsed = SubscriptionPlanCreateSchema.parse(req.body);
      const result = await this.subscriptionPlanService.createPlan(parsed);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Subscription plan created successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.createPlan"
      );
    }
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const parsed = SubscriptionPlanUpdateSchema.parse(req.body);
      const result = await this.subscriptionPlanService.updatePlan(id, parsed);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Subscription plan updated successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.updatePlan"
      );
    }
  }

  async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      await this.subscriptionPlanService.deletePlan(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Subscription plan deleted successfully",
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.deletePlan"
      );
    }
  }

  async getAllPlans(_: Request, res: Response): Promise<void> {
    try {
      const result = await this.subscriptionPlanService.getAllPlans();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "All subscription plans fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.getAllPlans"
      );
    }
  }

  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const result = await this.subscriptionPlanService.getPlanById(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Subscription plan fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.getPlanById"
      );
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
        message: "Subscription plan status updated",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "SubscriptionPlanController.togglePlanStatus"
      );
    }
  }
}

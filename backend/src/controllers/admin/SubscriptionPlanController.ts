// src/controllers/subscriptionPlan.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanController } from "../../interfaces/controllers/ISubscriptionPlanController";
import { ISubscriptionPlanService } from "../../interfaces/services/ISubscriptionPlanService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

@injectable()
export class SubscriptionPlanController implements ISubscriptionPlanController {
  constructor(
    @inject(TYPES.SubscriptionPlanService)
    private subscriptionPlanService: ISubscriptionPlanService
  ) {}

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const plan = await this.subscriptionPlanService.createPlan(req.body);
      res.status(HTTP_STATUS_CODES.CREATED).json(plan);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Failed to create subscription plan",
      });
    }
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await this.subscriptionPlanService.updatePlan(id, req.body);
      if (!plan) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Subscription plan not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json(plan);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Failed to update subscription plan",
      });
    }
  }

  async deletePlan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.subscriptionPlanService.deletePlan(id);
      if (!success) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Subscription plan not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json({
        message: "Subscription plan deleted successfully",
      });
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to delete subscription plan",
      });
    }
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await this.subscriptionPlanService.getAllPlans();
      res.status(HTTP_STATUS_CODES.OK).json(plans);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to fetch subscription plans",
      });
    }
  }

  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await this.subscriptionPlanService.getPlanById(id);
      if (!plan) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Subscription plan not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json(plan);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to fetch subscription plan",
      });
    }
  }

  async togglePlanStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const plan = await this.subscriptionPlanService.togglePlanStatus(
        id,
        isActive
      );
      if (!plan) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Subscription plan not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json(plan);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to toggle subscription plan status",
      });
    }
  }
}

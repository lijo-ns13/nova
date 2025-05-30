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

  private handleError(error: any, res: Response): void {
    // Handle Zod validation errors
    if (error.statusCode === 400 && error.success === false) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        errors: error.errors,
      });
      return;
    }

    // Handle conflict errors
    if (error.message && error.message.includes("already exists")) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message,
      });
      return;
    }

    // Generic error handling
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Internal server error",
    });
  }

  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body sub create", req.body);
      const plan = await this.subscriptionPlanService.createPlan(req.body);
      res.status(HTTP_STATUS_CODES.CREATED).json(plan);
    } catch (error: any) {
      this.handleError(error, res);
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
      this.handleError(error, res);
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
      this.handleError(error, res);
    }
  }

  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await this.subscriptionPlanService.getAllPlans();
      res.status(HTTP_STATUS_CODES.OK).json(plans);
    } catch (error: any) {
      this.handleError(error, res);
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
      this.handleError(error, res);
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
      this.handleError(error, res);
    }
  }
}

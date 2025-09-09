// src/controllers/subscriptionWithFeatures.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ISubscriptionWithFeaturesController } from "../../interfaces/controllers/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesService } from "../../interfaces/services/ISubscriptionWithFeatures";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";
interface userPayload {
  id: string;
  email: string;
  role: string;
}
@injectable()
export class SubscriptionWithFeaturesController
  implements ISubscriptionWithFeaturesController
{
  constructor(
    @inject(TYPES.SubscriptionWithFeaturesService)
    private _subscriptionFeatService: ISubscriptionWithFeaturesService
  ) {}
  async userCurrentSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as userPayload)?.id;
      const data =
        await this._subscriptionFeatService.getUserCurrentSubscription(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Successfully retrieved user subscription data",
        data,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to get subscription data",
      });
    }
  }
  async getActiveSubscriptionsWithFeatures(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result =
        await this._subscriptionFeatService.getActiveSubscriptionsWithFeatures();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          (error as Error).message ||
          "Failed to fetch subscriptions with features",
      });
    }
  }
}

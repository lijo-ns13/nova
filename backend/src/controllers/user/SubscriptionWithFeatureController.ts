// src/controllers/subscriptionWithFeatures.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ISubscriptionWithFeaturesController } from "../../interfaces/controllers/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesService } from "../../interfaces/services/ISubscriptionWithFeatures";

@injectable()
export class SubscriptionWithFeaturesController
  implements ISubscriptionWithFeaturesController
{
  constructor(
    @inject(TYPES.SubscriptionWithFeaturesService)
    private service: ISubscriptionWithFeaturesService
  ) {}

  async getActiveSubscriptionsWithFeatures(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const result = await this.service.getActiveSubscriptionsWithFeatures();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch subscriptions with features",
      });
    }
  }
}

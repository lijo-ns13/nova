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
    private service: ISubscriptionWithFeaturesService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private _subRepo: ISubscriptionPlanRepository,
    @inject(TYPES.FeatureRepository) private _featRepo: IFeatureRepository
  ) {}
  async userCurrentSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as userPayload)?.id;
      const user = await this._userRepo.findById(userId);
      if (!user) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "user not found" });
        return;
      }
      if (!user?.subscription) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "user not taken subscriptoin" });
        return;
      }
      const subData = await this._subRepo.findById(
        user?.subscription?.toString()
      );
      if (!subData) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "sub data not found" });
      }
      const features = await this._featRepo.findAll();
      const featName = features.map((feat) => feat.name);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "succesfully retrived user sub data",
        data: { subcription: subData, features: featName },
      });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "failed to get sub data" });
    }
  }
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

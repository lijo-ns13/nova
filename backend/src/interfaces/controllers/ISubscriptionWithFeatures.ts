// src/interfaces/controllers/ISubscriptionWithFeaturesController.ts
import { Request, Response } from "express";

export interface ISubscriptionWithFeaturesController {
  getActiveSubscriptionsWithFeatures(
    req: Request,
    res: Response
  ): Promise<void>;
  userCurrentSubscription(req: Request, res: Response): Promise<void>;
}

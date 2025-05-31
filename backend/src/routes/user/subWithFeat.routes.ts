import { Router } from "express";

import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";
import { ISubscriptionWithFeaturesController } from "../../interfaces/controllers/ISubscriptionWithFeatures";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const subWithFeatController =
  container.get<ISubscriptionWithFeaturesController>(
    TYPES.SubscriptionWithFeaturesController
  );

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

// Get all skills for the authenticated user
router.get("/", (req, res) =>
  subWithFeatController.getActiveSubscriptionsWithFeatures(req, res)
);

export default router;

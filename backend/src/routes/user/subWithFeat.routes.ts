import { Router } from "express";

import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";
import { ISubscriptionWithFeaturesController } from "../../interfaces/controllers/ISubscriptionWithFeatures";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const subWithFeatController =
  container.get<ISubscriptionWithFeaturesController>(
    TYPES.SubscriptionWithFeaturesController
  );

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.USER));
router.use(authMiddleware.check());

router.get(COMMON_ROUTES.ROOT, (req, res) =>
  subWithFeatController.getActiveSubscriptionsWithFeatures(req, res)
);
router.get(COMMON_ROUTES.USERSUB, (req, res) =>
  subWithFeatController.userCurrentSubscription(req, res)
);

export default router;

// src/routes/subscriptionPlan.routes.ts
import { Router } from "express";
import container from "../../di/container";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanController } from "../../interfaces/controllers/ISubscriptionPlanController";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";
import { SUBSCRIPTION_PLAN_ROUTES } from "../../constants/routes/adminRoutes";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const subscriptionPlanController = container.get<ISubscriptionPlanController>(
  TYPES.SubscriptionPlanController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));
router.use(authMiddleware.check());

// Create a new subscription plan
router.post(SUBSCRIPTION_PLAN_ROUTES.ROOT, (req, res) =>
  subscriptionPlanController.createPlan(req, res)
);

// Get all subscription plans
router.get(SUBSCRIPTION_PLAN_ROUTES.ROOT, (req, res) =>
  subscriptionPlanController.getAllPlans(req, res)
);
router.get(SUBSCRIPTION_PLAN_ROUTES.TRANSACTIONS, (req, res) =>
  subscriptionPlanController.getFilteredTransactions(req, res)
);
// Get a specific subscription plan
router.get(SUBSCRIPTION_PLAN_ROUTES.BY_ID, (req, res) =>
  subscriptionPlanController.getPlanById(req, res)
);

// Update a subscription plan
router.put(SUBSCRIPTION_PLAN_ROUTES.BY_ID, (req, res) =>
  subscriptionPlanController.updatePlan(req, res)
);

// Delete a subscription plan
router.delete(SUBSCRIPTION_PLAN_ROUTES.BY_ID, (req, res) =>
  subscriptionPlanController.deletePlan(req, res)
);

// Toggle plan status (active/inactive)
router.patch(SUBSCRIPTION_PLAN_ROUTES.STATUS, (req, res) =>
  subscriptionPlanController.togglePlanStatus(req, res)
);

export default router;

// src/routes/subscriptionPlan.routes.ts
import { Router } from "express";
import container from "../../di/container";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanController } from "../../interfaces/controllers/ISubscriptionPlanController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const subscriptionPlanController = container.get<ISubscriptionPlanController>(
  TYPES.SubscriptionPlanController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));
router.use(authMiddleware.check());

// Create a new subscription plan
router.post("/", (req, res) => subscriptionPlanController.createPlan(req, res));

// Get all subscription plans
router.get("/", (req, res) => subscriptionPlanController.getAllPlans(req, res));

// Get a specific subscription plan
router.get("/:id", (req, res) =>
  subscriptionPlanController.getPlanById(req, res)
);

// Update a subscription plan
router.put("/:id", (req, res) =>
  subscriptionPlanController.updatePlan(req, res)
);

// Delete a subscription plan
router.delete("/:id", (req, res) =>
  subscriptionPlanController.deletePlan(req, res)
);

// Toggle plan status (active/inactive)
router.patch("/:id/status", (req, res) =>
  subscriptionPlanController.togglePlanStatus(req, res)
);

export default router;

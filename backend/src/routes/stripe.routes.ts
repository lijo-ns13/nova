// routes/stripeRoutes.ts
import express from "express";

import { TYPES } from "../di/types";
import { IStripeController } from "../interfaces/controllers/IStripeController";
import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const router = express.Router();

const stripeController = container.get<IStripeController>(
  TYPES.StripeController
);
router.use(authMiddleware.authenticate("user"));
router.post("/create-checkout-session", (req, res) =>
  stripeController.createCheckoutSession(req, res)
);

router.post("/refund", (req, res) => stripeController.handleRefund(req, res));

router.get("/session/:userId", (req, res) =>
  stripeController.getLatestTransactionSession(req, res)
);

export default router;

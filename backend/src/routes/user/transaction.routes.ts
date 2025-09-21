import { Router } from "express";

import container from "../../di/container";
import { ITransactionController } from "../../interfaces/controllers/ITransactionController";
import { TYPES } from "../../di/types";

const router = Router();
const controller = container.get<ITransactionController>(
  TYPES.TransactionController
);

router.post("/create-checkout-session", (req, res) =>
  controller.createCheckoutSession(req, res)
);
router.post("/refund", (req, res) => controller.refund(req, res));
router.get("/confirm-session/:sessionId", (req, res) =>
  controller.confirmPaymentSession(req, res)
);
router.get("/session/:userId", (req, res) =>
  controller.getLatestSession(req, res)
);
router.get("/session-details/:sessionId", (req, res) =>
  controller.getTransactionDetails(req, res)
);

export default router;

import { Router } from "express";

import container from "../../di/container";
import { ITransactionController } from "../../interfaces/controllers/ITransactionController";
import { TYPES } from "../../di/types";
import { TRANSACTION_ROUTES } from "../../constants/routes/userRoutes";

const router = Router();
const controller = container.get<ITransactionController>(
  TYPES.TransactionController
);

router.post(TRANSACTION_ROUTES.CREATE_CHECKOUT_SESSION, (req, res) =>
  controller.createCheckoutSession(req, res)
);
router.post(TRANSACTION_ROUTES.REFUND, (req, res) =>
  controller.refund(req, res)
);
router.get(TRANSACTION_ROUTES.CONFIRM_SESSION, (req, res) =>
  controller.confirmPaymentSession(req, res)
);
router.get(TRANSACTION_ROUTES.GET_SESSION, (req, res) =>
  controller.getLatestSession(req, res)
);
router.get(TRANSACTION_ROUTES.GET_SESSION_DETAILS, (req, res) =>
  controller.getTransactionDetails(req, res)
);

export default router;

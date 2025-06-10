import express from "express";
import { createCheckoutSession } from "../controllers/stripe.controller";
import { handleRefund } from "../controllers/refund.controller";
import tranasctionModal from "../models/tranasction.modal";

const router = express.Router();
// /api/stripe
router.post("/create-checkout-session", createCheckoutSession);
router.post("/refund", handleRefund);
// GET /api/refund/session/:userId
router.get("/session/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const latestTransaction = await tranasctionModal
      .findOne({ userId, status: "completed" })
      .sort({ createdAt: -1 });

    if (!latestTransaction) {
      res.status(404).json({ message: "No completed transaction found" });
      return;
    }

    res.status(200).json({
      stripeSessionId: latestTransaction.stripeSessionId,
      planName: latestTransaction.planName,
      amount: latestTransaction.amount,
      currency: latestTransaction.currency,
      createdAt: latestTransaction.createdAt,
    });
    return;
  } catch (err) {
    console.error("Error fetching session ID:", err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});
export default router;

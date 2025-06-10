import { Request, Response } from "express";
import Stripe from "stripe";

import userModel from "../models/user.modal";
import tranasctionModal from "../models/tranasction.modal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const handleRefund = async (req: Request, res: Response) => {
  const { stripeSessionId, reason } = req.body;

  try {
    // ✅ Find transaction
    const transaction = await tranasctionModal.findOne({ stripeSessionId });
    if (!transaction || transaction.status !== "completed") {
      res.status(400).json({ message: "Invalid transaction for refund" });
      return;
    }

    // ✅ Get payment_intent from Stripe session
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paymentIntent = session.payment_intent as string;

    // ✅ Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntent,
      reason: "requested_by_customer",
    });

    // ✅ Update transaction
    transaction.status = "refunded";
    transaction.refundReason = reason || "Requested by user";
    transaction.refundDate = new Date();
    transaction.stripeRefundId = refund.id;
    await transaction.save();

    // ✅ Revoke subscription in user model
    await userModel.findByIdAndUpdate(transaction.userId, {
      isSubscriptionTaken: false,
      subscriptionExpiresAt: null,
      subscription: null,
    });

    res.status(200).json({ message: "Refund successful", refund });
  } catch (err) {
    console.error("❌ Refund failed:", err);
    res.status(500).json({ message: "Refund processing failed" });
  }
};

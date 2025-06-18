// controllers/stripeController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import userModal from "../models/user.modal";
import tranasctionModal from "../models/tranasction.modal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { price, userId, metadata } = req.body;
  console.log("req.bodycreatesetion", req.body);

  try {
    const user = await userModal.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const now = new Date();

    // ✅ Block if already subscribed
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
      res
        .status(400)
        .json({ message: "You already have an active subscription" });
      return;
    }

    // 🔒 Check if there's an active session
    if (
      user.activePaymentSession &&
      user.activePaymentSessionExpiresAt &&
      user.activePaymentSessionExpiresAt > now
    ) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        user.activePaymentSession
      );

      // ♻️ If same plan → reuse session
      if (
        existingSession &&
        existingSession.metadata?.planName === metadata.planName
      ) {
        res.status(200).json({ url: existingSession.url });
        return;
      }

      // ❌ If different plan → block session creation
      res.status(409).json({
        message:
          "You already have a pending payment session for a different plan. Please complete it or wait until it expires.",
        url: existingSession.url,
      });
      return;
    }

    // ✅ Create new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: metadata.planName || "Subscription Plan",
            },
            unit_amount: Math.round(price * 100), // convert to paisa
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      metadata,
    });

    // 💾 Save session info to user
    await userModal.findByIdAndUpdate(userId, {
      activePaymentSession: session.id,
      activePaymentSessionExpiresAt: new Date(session.expires_at! * 1000),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    res.status(500).json({ error: "Payment session creation failed" });
  }
};
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
    await userModal.findByIdAndUpdate(transaction.userId, {
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

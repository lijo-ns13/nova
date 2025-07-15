// controllers/stripeController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import userModal from "../models/user.modal";
import tranasctionModal from "../models/tranasction.modal";
import subscriptionModal from "../models/subscription.modal";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { price, userId, metadata } = req.body;

  try {
    const user = await userModal.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const now = new Date();

    // Check existing subscription
    if (
      user.subscriptionEndDate &&
      user.subscriptionEndDate > now &&
      user.isSubscriptionActive
    ) {
      res
        .status(400)
        .json({ message: "You already have an active subscription" });
      return;
    }

    // Check active session
    if (
      user.activePaymentSession &&
      user.activePaymentSessionExpiresAt &&
      user.activePaymentSessionExpiresAt > now
    ) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        user.activePaymentSession
      );

      if (existingSession?.metadata?.planName === metadata.planName) {
        res.status(200).json({ url: existingSession.url });
        return;
      }

      res.status(409).json({
        message:
          "You already have a pending payment session for a different plan.",
        url: existingSession.url,
      });
      return;
    }

    const orderId = uuidv4();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: metadata.planName || "Subscription Plan" },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata: {
        ...metadata,
        userId,
        orderId, // ✅ for traceability
        price: price.toString(),
      },
    });

    await userModal.findByIdAndUpdate(userId, {
      activePaymentSession: session.id,
      activePaymentSessionExpiresAt: new Date(session.expires_at! * 1000),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout session creation failed:", err);
    res.status(500).json({ message: "Payment session creation failed" });
  }
};

export const confirmPaymentSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.charges"],
    });

    if (!session || session.payment_status !== "paid") {
      res.status(400).json({ message: "Payment not completed yet" });
      return;
    }

    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName || "Unknown Plan";
    const orderId = session.metadata?.orderId || uuidv4();

    if (!userId) {
      res.status(400).json({ message: "User ID missing in session metadata" });
      return;
    }

    const existingTxn = await tranasctionModal.findOne({
      stripeSessionId: sessionId,
    });
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent & {
      charges: {
        data: Stripe.Charge[];
      };
    };

    const receiptUrl = paymentIntent?.charges?.data?.[0]?.receipt_url || null;

    if (existingTxn) {
      res.status(200).json({
        message: "Payment already confirmed",
        data: {
          orderId: existingTxn.orderId,
          amount: existingTxn.amount,
          currency: existingTxn.currency,
          planName: existingTxn.planName,
          sessionId,
          receiptUrl,
        },
      });
      return;
    }

    const subscription = await subscriptionModal.findOne({ name: planName });
    if (!subscription) {
      res.status(400).json({ message: "Subscription plan not found" });
      return;
    }

    const now = new Date();
    const endDate = moment(now).add(subscription.validityDays, "days").toDate();

    const newTransaction = new tranasctionModal({
      userId,
      orderId,
      amount: session.amount_total! / 100,
      currency: session.currency || "inr",
      status: "completed",
      paymentMethod: session.payment_method_types?.[0] || "unknown",
      stripeSessionId: session.id,
      stripeRefundId: null,
      planName,
    });

    await newTransaction.save();

    await userModal.findByIdAndUpdate(userId, {
      $set: {
        isSubscriptionActive: true,
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        subscriptionCancelled: false,
        subscription: subscription._id,
      },
      $unset: {
        activePaymentSession: 1,
        activePaymentSessionExpiresAt: 1,
      },
    });

    res.status(200).json({
      message: "Subscription activated successfully",
      data: {
        orderId,
        amount: session.amount_total! / 100,
        currency: session.currency || "inr",
        planName,
        sessionId,
        expiresAt: endDate,
        receiptUrl,
      },
    });
  } catch (err) {
    console.error("❌ Error confirming payment session:", err);
    res.status(500).json({ message: "Failed to confirm payment session" });
  }
};

const REFUND_WINDOW_DAYS = 15;
const MAX_JOB_LIMIT = 5;
const MAX_POST_LIMIT = 5;

export const handleRefund = async (req: Request, res: Response) => {
  const { stripeSessionId, reason } = req.body;

  try {
    const transaction = await tranasctionModal.findOne({ stripeSessionId });
    if (!transaction || transaction.status !== "completed") {
      res
        .status(400)
        .json({ message: "Invalid or already refunded transaction." });
      return;
    }

    const user = await userModal.findById(transaction.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // 🔒 Check: Job & Post usage
    if (
      user.appliedJobCount >= MAX_JOB_LIMIT ||
      user.createdPostCount >= MAX_POST_LIMIT
    ) {
      res.status(403).json({
        message:
          "Refund not allowed after significant usage (5+ job applies or posts).",
      });
      return;
    }

    // 🔒 Check: Purchase date within 15 days
    if (!user.subscriptionStartDate) {
      res.status(400).json({ message: "No active subscription found." });
      return;
    }

    const now = new Date();
    const purchasedAt = moment(user.subscriptionStartDate);
    const daysSincePurchase = moment(now).diff(purchasedAt, "days");

    if (daysSincePurchase > REFUND_WINDOW_DAYS) {
      res.status(403).json({
        message: `Refund only allowed within ${REFUND_WINDOW_DAYS} days of purchase.`,
      });
      return;
    }

    // ✅ Proceed with refund
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paymentIntentId = session.payment_intent as string;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: "requested_by_customer",
    });

    // 💾 Update transaction
    transaction.status = "refunded";
    transaction.refundReason = reason || "Requested by user";
    transaction.refundDate = now;
    transaction.stripeRefundId = refund.id;
    await transaction.save();

    // 💾 Update user subscription status
    await userModal.findByIdAndUpdate(user._id, {
      $set: {
        isSubscriptionActive: false,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        subscriptionCancelled: true,
        subscription: null,
      },
    });

    res.status(200).json({ message: "Refund successful", refund });
  } catch (err) {
    console.error("❌ Refund failed:", err);
    res.status(500).json({ message: "Refund processing failed" });
  }
};

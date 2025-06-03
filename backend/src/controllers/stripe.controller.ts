// controllers/stripeController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import userModal from "../models/user.modal";

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
      success_url: `${process.env.CLIENT_URL}/payment-success`,
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

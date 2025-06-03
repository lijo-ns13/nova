// controllers/stripeController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import userModal from "../models/user.modal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});
// controllers/stripeController.ts
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { price, userId, metadata } = req.body;
  console.log("req.bodycreatesetion", req.body);
  try {
    const user = await userModal.findById(userId);
    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }
    const now = new Date();
    console.log("user", user);
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
      res
        .status(400)
        .json({ message: "You already have an active subscription" });
      return;
    }

    // Check for existing active payment session (not expired)
    if (
      user?.activePaymentSession &&
      user.activePaymentSessionExpiresAt &&
      user.activePaymentSessionExpiresAt > new Date()
    ) {
      // Return existing session URL instead of creating new one
      const existingSession = await stripe.checkout.sessions.retrieve(
        user.activePaymentSession
      );
      res.status(200).json({ url: existingSession.url });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // or your currency
            product_data: {
              name: metadata.planName || "Subscription Plan",
            },
            unit_amount: price * 100, // price in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata,
    });

    // Save active session to user
    await userModal.findByIdAndUpdate(userId, {
      activePaymentSession: session.id,
      activePaymentSessionExpiresAt: new Date(session.expires_at * 1000),
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ error: "Payment session creation failed" });
  }
};

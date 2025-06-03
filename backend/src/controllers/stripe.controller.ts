// controllers/stripeController.ts
import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // this is correct
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { price, userId, metadata } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: metadata?.planName || "Premium Subscription",
            },
            unit_amount: price * 100, // convert to paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId,
        planName: metadata?.planName,
        subscriptionType: metadata?.subscriptionType,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Stripe session creation failed." });
  }
};

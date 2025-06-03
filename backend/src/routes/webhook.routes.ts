// routes/webhook.ts
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { updateUserSubscription } from "../services/subscription.service";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // this is correct
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook error:", (err as Error).message);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const subscriptionType = session.metadata?.subscriptionType;

      if (userId && subscriptionType) {
        await updateUserSubscription(userId, subscriptionType);
      }
    }

    res.json({ received: true });
  }
);

export default router;

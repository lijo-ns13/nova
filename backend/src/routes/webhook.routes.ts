// routes/webhook.ts
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { updateUserSubscription } from "../services/subscription.service";
import userModal from "../models/user.modal";
import moment from "moment";
import tranasctionModal from "../models/tranasction.modal";
import subscriptionModal from "../models/subscription.modal";

import { TYPES } from "../di/types";
import container from "../di/container";
interface Userr {
  id: string;
  name: string;
  email: string;
}
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
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
      console.log("✅ CHECKOUT SESSION COMPLETED", session);
      const userId = session.metadata?.userId;
      if (!userId) {
        console.error("User ID not found in metadata");
        res.status(400).json({ error: "User ID not found" });
        return;
      }
      console.log("🔍 Session payment_status:", session.payment_status);
      console.log("🔍 Session metadata:", session.metadata);

      if (session.payment_status === "paid") {
        const subscriptionType = session.metadata?.subscriptionType;
        const planName = session.metadata?.planName;
        console.log("🧠 Updating user:", userId);

        const subscription = await subscriptionModal.findOne({
          name: subscriptionType,
        });
        console.log("🎫 Subscription found:", subscription);

        const newTransaction = new tranasctionModal({
          userId: userId,
          amount: session.amount_total! / 100, // convert from paisa if needed
          currency: session.currency || "inr",
          status: "completed",
          paymentMethod: session.payment_method_types?.[0] || "unknown",
          stripeSessionId: session.id,
          planName: planName,
          subscriptionType: subscriptionType,
        });

        await newTransaction.save();
        console.log("💾 Transaction saved");

        const updateRes = await userModal.findByIdAndUpdate(
          userId,
          {
            $unset: {
              activePaymentSession: 1,
              activePaymentSessionExpiresAt: 1,
            },
            $set: {
              isSubscriptionTaken: true,
              subscription: subscription?._id,
              subscriptionExpiresAt: moment()
                .add(subscription?.validityDays ?? 0, "days")
                .toDate(),
            },
          },
          { new: true }
        );

        console.log("✅ User updated:", updateRes);
      }
    }

    res.json({ received: true });
  }
);

export default router;

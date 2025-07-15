import cron from "node-cron";
import userModal from "../models/user.modal";
import logger from "../utils/logger"; // ← use Winston or Pino logger

const now = () => new Date();

// ⏰ Every 10 minutes: Remove expired Stripe sessions
cron.schedule("*/10 * * * *", async () => {
  try {
    const result = await userModal.updateMany(
      { activePaymentSessionExpiresAt: { $lt: now() } },
      {
        $unset: {
          activePaymentSession: "",
          activePaymentSessionExpiresAt: "",
        },
      }
    );

    logger.info(
      `🧹 Cleaned up ${result.modifiedCount} expired Stripe sessions.`
    );
  } catch (err) {
    logger.error("❌ Failed to clean expired sessions:", err);
  }
});

// 🗓️ Monthly reset on 1st at midnight
cron.schedule("0 0 1 * *", async () => {
  try {
    const currentDate = now();

    // Step 1: Reset expired/inactive subscriptions
    const expiredReset = await userModal.updateMany(
      {
        $or: [
          { isSubscriptionActive: false },
          { subscriptionEndDate: { $lt: currentDate } },
          { subscription: null },
        ],
      },
      {
        $set: {
          isSubscriptionActive: false,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          subscription: null,
        },
      }
    );

    // Step 2: Reset subscriptionCancelled if no active sub
    const cancelledReset = await userModal.updateMany(
      {
        subscriptionCancelled: true,
        $or: [
          { isSubscriptionActive: false },
          { subscriptionEndDate: { $lt: currentDate } },
          { subscription: null },
        ],
      },
      {
        $set: { subscriptionCancelled: false },
      }
    );

    logger.info(
      `📆 Monthly reset: ${expiredReset.modifiedCount} subscriptions reset, ${cancelledReset.modifiedCount} cancelled flags cleared.`
    );
  } catch (err) {
    logger.error("❌ Monthly reset failed:", err);
  }
});

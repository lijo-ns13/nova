import cron from "node-cron";
import container from "./di/container";
import logger from "./utils/logger";
import { IUserRepository } from "./interfaces/repositories/IUserRepository";
import { TYPES } from "./di/types";

const now = () => new Date();
const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
// ⏰ Every 10 minutes: Remove expired Stripe sessions
cron.schedule("*/10 * * * *", async () => {
  try {
    const result = await userRepository.clearExpiredPaymentSessions();

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
    const expiredReset = await userRepository.resetExpiredSubscriptions();
    const cancelledReset = await userRepository.clearCancelledFlags();

    logger.info(
      `📆 Monthly reset: ${expiredReset.modifiedCount} subscriptions reset, ${cancelledReset.modifiedCount} cancelled flags cleared.`
    );
  } catch (err) {
    logger.error("❌ Monthly reset failed:", err);
  }
});

import cron from "node-cron";
import userModal from "../models/user.modal";
// Monthly: Reset two fields to 0 on the 1st of every month at midnight
cron.schedule("0 0 1 * *", async () => {
  try {
    await userModal.updateMany(
      {},
      { $set: { isSubscriptionTaken: false, subscriptionExpiresAt: null } }
    );
    console.log("✅ Monthly reset: field1 and field2 set to 0 for all users.");
  } catch (err) {
    console.error("❌ Error in monthly reset cron job:", err);
  }
});

// Every 3 minutes: Remove two fields
cron.schedule("*/3 * * * *", async () => {
  try {
    await userModal.updateMany(
      {},
      {
        $unset: {
          activePaymentSession: "",
          activePaymentSessionExpiresAt: null,
        },
      }
    );
    console.log("✅ Every 3 mins: field1 and field2 removed from all users.");
  } catch (err) {
    console.error("❌ Error in 3-minute cleanup cron job:", err);
  }
});

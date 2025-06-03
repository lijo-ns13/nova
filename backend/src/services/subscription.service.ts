// services/subscriptionService.ts

import subscriptionModal from "../models/subscription.modal";
import userModal from "../models/user.modal";

export const updateUserSubscription = async (
  userId: string,
  subscriptionType: string
) => {
  const subscription = await subscriptionModal.findOne({
    name: subscriptionType,
  });
  if (!subscription) throw new Error("Subscription plan not found");

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + subscription.validityDays * 24 * 60 * 60 * 1000
  );

  await userModal.findByIdAndUpdate(userId, {
    isSubscriptionTaken: true,
    subscriptionExpiresAt: expiresAt,
  });

  // Optional: store transaction record
};

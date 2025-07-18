// services/subscriptionService.ts
import subscriptionModal from "../models/subscription.modal";
import tranasctionModal from "../models/tranasction.modal";
import userModal from "../models/user.modal";

export const updateUserSubscription = async (
  userId: string,
  subscriptionType: string,
  stripeSessionId: string,
  amount: number
) => {
  // Check if user already has an active subscription
  const user = await userModal.findById(userId);
  if (
    user?.isSubscriptionActive &&
    user.subscriptionEndDate &&
    user.subscriptionEndDate > new Date()
  ) {
    throw new Error("User already has an active subscription");
  }

  const subscription = await subscriptionModal.findOne({
    name: subscriptionType,
  });
  if (!subscription) throw new Error("Subscription plan not found");

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + subscription.validityDays * 24 * 60 * 60 * 1000
  );

  // Update user subscription
  await userModal.findByIdAndUpdate(userId, {
    isSubscriptionActive: true,
    subscription: subscription._id,
    subscriptionEndDate: expiresAt,
  });

  // Create transaction record
  await tranasctionModal.create({
    userId,
    amount,
    currency: "inr",
    status: "completed",
    paymentMethod: "card",
    stripeSessionId,
    planName: subscription.name,
  });
};

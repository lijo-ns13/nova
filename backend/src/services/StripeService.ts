// services/stripeService.ts
import { inject, injectable } from "inversify";
import { IStripeService } from "../interfaces/services/IStripeService";
import Stripe from "stripe";
import { TYPES } from "../di/types";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionRepository";
import { ITransaction } from "../models/tranasction.modal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

@injectable()
export class StripeService implements IStripeService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.TransactionRepository)
    private transactionRepository: ITransactionRepository
  ) {}

  async createCheckoutSession(
    price: number,
    userId: string,
    metadata: any
  ): Promise<{ url: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();

    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) {
      throw new Error("You already have an active subscription");
    }

    if (
      user.activePaymentSession &&
      user.activePaymentSessionExpiresAt &&
      user.activePaymentSessionExpiresAt > now
    ) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        user.activePaymentSession
      );

      if (existingSession?.metadata?.planName === metadata.planName) {
        return { url: existingSession.url };
      }

      throw new Error(
        "You already have a pending payment session for a different plan. Please complete it or wait until it expires."
      );
    }

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
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata,
    });

    await this.userRepository.updateUser(userId, {
      activePaymentSession: session.id,
      activePaymentSessionExpiresAt: new Date(session.expires_at! * 1000),
    });

    return { url: session.url };
  }

  async handleRefund(
    stripeSessionId: string,
    reason: string = "requested_by_customer"
  ): Promise<{ message: string; refund: Stripe.Refund }> {
    const transactions = await this.transactionRepository.find({
      stripeSessionId,
      status: "completed",
    });

    if (transactions.length === 0) {
      throw new Error("Invalid transaction for refund");
    }

    const transaction = transactions[0];
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    if (!session.payment_intent) {
      throw new Error("Payment intent not found");
    }

    const refund = await stripe.refunds.create({
      payment_intent: session.payment_intent as string,
      reason,
    });

    await this.transactionRepository.updateTransactionStatus(
      transaction._id.toString(),
      "refunded",
      {
        refundReason: reason,
        refundDate: new Date(),
        stripeRefundId: refund.id,
      }
    );

    await this.userRepository.updateUser(transaction.userId.toString(), {
      isSubscriptionTaken: false,
      subscriptionExpiresAt: null,
      subscription: null,
    });

    return { message: "Refund successful", refund };
  }

  async getLatestTransactionSession(
    userId: string
  ): Promise<ITransaction | null> {
    const transactions = await this.transactionRepository.find({
      userId,
      status: "completed",
    });

    return transactions.length > 0
      ? transactions.reduce((latest, current) =>
          current.createdAt > latest.createdAt ? current : latest
        )
      : null;
  }
}

import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { TYPES } from "../../di/types";

import { ITransactionService } from "../../interfaces/services/ITransactionService";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import {
  ConfirmPaymentInput,
  ConfirmPaymentOutput,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionOutput,
  LatestTransactionDTO,
  TransactionDetailsDTO,
} from "../../core/dtos/user/tranasction/transaction";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import moment from "moment";
import { Types } from "mongoose";
import {
  RefundRequestInput,
  RefundResponseDTO,
} from "../../core/dtos/user/tranasction/refund.request.dto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});
const REFUND_WINDOW_DAYS = 15;
const MAX_JOB_LIMIT = 5;
const MAX_POST_LIMIT = 5;
@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly _transRepository: ITransactionRepository,
    @inject(TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private readonly _subRepo: ISubscriptionPlanRepository
  ) {}

  async createCheckoutSession({
    userId,
    price,
    metadata,
  }: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionOutput> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const now = new Date();

    // ✅ Subscription cancelled check
    if (user.subscriptionCancelled) {
      throw new Error(
        "You already subscribed and cancelled once this month. Please try again next month."
      );
    }

    // ✅ Active subscription check
    if (
      user.isSubscriptionActive &&
      user.subscriptionEndDate &&
      user.subscriptionEndDate > now
    ) {
      throw new Error("You already have an active subscription");
    }

    // ✅ Active payment session check
    if (
      user.activePaymentSession &&
      user.activePaymentSessionExpiresAt &&
      user.activePaymentSessionExpiresAt > now
    ) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        user.activePaymentSession
      );
      if (existingSession?.metadata?.planName === metadata.planName) {
        return { url: existingSession.url!, sessionId: existingSession.id };
      }
      throw new Error(
        `You already have a pending payment session for a different plan. Session URL: ${existingSession.url}`
      );
    }

    // ✅ Create new Stripe session
    const orderId = uuidv4();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: metadata.planName || "Subscription Plan" },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      metadata: {
        ...metadata,
        userId,
        orderId,
        price: price.toString(),
      },
    });

    await this._userRepo.updateUserPaymentSession(
      userId,
      session.id,
      new Date(session.expires_at! * 1000)
    );

    return { url: session.url!, sessionId: session.id };
  }
  async confirmPaymentSession({
    sessionId,
  }: ConfirmPaymentInput): Promise<ConfirmPaymentOutput> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-05-28.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.charges"],
    });

    if (!session || session.payment_status !== "paid") {
      throw new Error("Payment not completed yet");
    }

    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName || "Unknown Plan";
    const orderId = session.metadata?.orderId || uuidv4();

    if (!userId) throw new Error("User ID missing in session metadata");

    // 1. Check if transaction already exists
    const existingTxn = await this._transRepository.findTransactionBySession(
      sessionId
    );

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent & {
      charges: { data: Stripe.Charge[] };
    };
    const receiptUrl = paymentIntent?.charges?.data?.[0]?.receipt_url || null;

    if (existingTxn) {
      return {
        orderId: existingTxn.orderId,
        amount: existingTxn.amount,
        currency: existingTxn.currency,
        planName: existingTxn.planName,
        sessionId,
        expiresAt: existingTxn.updatedAt!, // approximate
        receiptUrl,
      };
    }

    // 2. Find subscription
    const subscription = await this._subRepo.findSubscriptionByName(planName);
    if (!subscription) throw new Error("Subscription plan not found");

    const now = new Date();
    const endDate = moment(now).add(subscription.validityDays, "days").toDate();

    // 3. Create transaction
    await this._transRepository.createTransaction({
      userId: new Types.ObjectId(userId),
      orderId,
      amount: session.amount_total! / 100,
      currency: session.currency || "inr",
      status: "completed",
      paymentMethod: session.payment_method_types?.[0] || "unknown",
      stripeSessionId: session.id,
      stripeRefundId: null,
      planName,
      createdAt: now,
    });

    // 4. Update user subscription
    await this._userRepo.updateUserSubscription(
      userId,
      {
        isSubscriptionActive: true,
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        subscriptionCancelled: false,
        subscription: subscription._id,
      },
      {
        activePaymentSession: 1,
        activePaymentSessionExpiresAt: 1,
      }
    );

    return {
      orderId,
      amount: session.amount_total! / 100,
      currency: session.currency || "inr",
      planName,
      sessionId,
      expiresAt: endDate,
      receiptUrl,
    };
  }
  async processRefund(input: RefundRequestInput): Promise<RefundResponseDTO> {
    const { stripeSessionId, reason } = input;

    // 1️⃣ Fetch transaction
    const transaction = await this._transRepository.findByStripeSessionId(
      stripeSessionId
    );
    if (!transaction || transaction.status !== "completed") {
      throw new Error("Invalid or already refunded transaction.");
    }

    // 2️⃣ Fetch user
    const user = await this._userRepo.findById(transaction.userId.toString());
    if (!user) throw new Error("User not found.");

    // 3️⃣ Usage checks
    if (
      user.appliedJobCount >= MAX_JOB_LIMIT ||
      user.createdPostCount >= MAX_POST_LIMIT
    ) {
      throw new Error(
        "Refund not allowed after significant usage (5+ job applies or posts)."
      );
    }

    if (!user.subscriptionStartDate) {
      throw new Error("No active subscription found.");
    }

    const daysSincePurchase = moment().diff(
      moment(user.subscriptionStartDate),
      "days"
    );
    if (daysSincePurchase > REFUND_WINDOW_DAYS) {
      throw new Error(
        `Refund only allowed within ${REFUND_WINDOW_DAYS} days of purchase.`
      );
    }

    // 4️⃣ Refund via Stripe
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paymentIntentId = session.payment_intent as string;
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: "requested_by_customer",
    });

    const now = new Date();

    // 5️⃣ Update transaction
    await this._transRepository.updateTransaction(transaction._id.toString(), {
      status: "refunded",
      refundReason: reason || "Requested by user",
      refundDate: now,
      stripeRefundId: refund.id,
    });

    // 6️⃣ Update user subscription
    await this._userRepo.updateSubscription(user._id.toString(), {
      isSubscriptionActive: false,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      subscriptionCancelled: true,
      subscription: null,
    });

    return { message: "Refund successful", refundId: refund.id };
  }
  async getLatestTransactionByUser(
    userId: string
  ): Promise<LatestTransactionDTO> {
    const txn = await this._transRepository.findLatestTransactionByUser(userId);

    if (!txn) throw new Error("No completed transaction found");

    return {
      stripeSessionId: txn.stripeSessionId,
      planName: txn.planName,
      amount: txn.amount,
      currency: txn.currency,
      createdAt: txn.createdAt!,
    };
  }
  async getTransactionDetails(
    sessionId: string
  ): Promise<TransactionDetailsDTO> {
    const txn = await this._transRepository.findByStripeSessionId(sessionId);
    if (!txn) throw new Error("Transaction not found");

    return {
      stripeSessionId: txn.stripeSessionId,
      userId: txn.userId,
      planName: txn.planName,
      amount: txn.amount,
      currency: txn.currency,
      status: txn.status,
      paymentMethod: txn.paymentMethod,
      createdAt: txn.createdAt!,
      updatedAt: txn.updatedAt!,
      refundDate: txn.refundDate || null,
      refundReason: txn.refundReason || null,
      stripeRefundId: txn.stripeRefundId || null,
    };
  }
}

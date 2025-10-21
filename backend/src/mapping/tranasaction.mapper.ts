import { injectable } from "inversify";
import Stripe from "stripe";
import {
  ConfirmPaymentOutput,
  CreateCheckoutSessionOutput,
  LatestTransactionDTO,
  TransactionDetailsDTO,
} from "../core/dtos/user/tranasction/transaction";
import { ITransaction } from "../repositories/entities/transaction.entity";

export class TransactionMapper {
  // Map Stripe Checkout Session to CreateCheckoutSessionOutput
  static toCreateCheckoutSessionOutput(
    session: Stripe.Checkout.Session
  ): CreateCheckoutSessionOutput {
    return {
      url: session.url!,
      sessionId: session.id,
    };
  }

  // Map Stripe Checkout Session and Transaction to ConfirmPaymentOutput
  static toConfirmPaymentOutput(
    session: Stripe.Checkout.Session,
    transaction?: ITransaction
  ): ConfirmPaymentOutput {
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent & {
      charges: { data: Stripe.Charge[] };
    };
    const receiptUrl = paymentIntent?.charges?.data?.[0]?.receipt_url || null;

    if (transaction) {
      return {
        orderId: transaction.orderId,
        amount: transaction.amount,
        currency: transaction.currency,
        planName: transaction.planName,
        sessionId: session.id,
        expiresAt: transaction.updatedAt!,
        receiptUrl,
      };
    }

    return {
      orderId: session.metadata?.orderId || "",
      amount: session.amount_total! / 100,
      currency: session.currency || "inr",
      planName: session.metadata?.planName || "Unknown Plan",
      sessionId: session.id,
      expiresAt: new Date(session.expires_at! * 1000),
      receiptUrl,
    };
  }

  // Map ITransaction to LatestTransactionDTO
  static toLatestTransactionDTO(
    transaction: ITransaction
  ): LatestTransactionDTO {
    return {
      stripeSessionId: transaction.stripeSessionId,
      planName: transaction.planName,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt!,
    };
  }

  // Map ITransaction to TransactionDetailsDTO
  static toTransactionDetailsDTO(
    transaction: ITransaction
  ): TransactionDetailsDTO {
    return {
      stripeSessionId: transaction.stripeSessionId,
      userId: transaction.userId,
      planName: transaction.planName,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      createdAt: transaction.createdAt!,
      updatedAt: transaction.updatedAt!,
      refundDate: transaction.refundDate || null,
      refundReason: transaction.refundReason || null,
      stripeRefundId: transaction.stripeRefundId || null,
    };
  }
}

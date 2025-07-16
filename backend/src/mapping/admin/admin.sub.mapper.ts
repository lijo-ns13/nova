import { Types } from "mongoose";
import { TransactionResponseDTO } from "../../core/dtos/admin/admin.sub.dto";
import { ITransaction } from "../../models/tranasction.modal";
export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}
export interface ITransactionPopulated extends Omit<ITransaction, "userId"> {
  userId: PopulatedUser;
}
export interface TransactionListWithPagination {
  transactions: TransactionResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

export const mapTransactionToDTO = (
  txn: ITransactionPopulated
): TransactionResponseDTO => {
  return {
    id: txn._id.toString(),
    user: {
      id: txn.userId._id.toString(),
      name: txn.userId.name,
      email: txn.userId.email,
    },
    amount: txn.amount,
    currency: txn.currency,
    status: txn.status,
    paymentMethod: txn.paymentMethod,
    stripeSessionId: txn.stripeSessionId,
    stripeRefundId: txn.stripeRefundId ?? null,
    planName: txn.planName,
    refundReason: txn.refundReason ?? null,
    refundDate: txn.refundDate?.toISOString() ?? null,
    createdAt: txn.createdAt?.toISOString() ?? new Date().toISOString(),
  };
};

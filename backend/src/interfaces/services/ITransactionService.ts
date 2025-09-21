import {
  RefundRequestInput,
  RefundResponseDTO,
} from "../../core/dtos/user/tranasction/refund.request.dto";
import {
  ConfirmPaymentInput,
  ConfirmPaymentOutput,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionOutput,
  LatestTransactionDTO,
  TransactionDetailsDTO,
} from "../../core/dtos/user/tranasction/transaction";

export interface ITransactionService {
  getTransactionDetails(sessionId: string): Promise<TransactionDetailsDTO>;
  createCheckoutSession({
    userId,
    price,
    metadata,
  }: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionOutput>;
  confirmPaymentSession({
    sessionId,
  }: ConfirmPaymentInput): Promise<ConfirmPaymentOutput>;
  processRefund(input: RefundRequestInput): Promise<RefundResponseDTO>;
  getLatestTransactionByUser(userId: string): Promise<LatestTransactionDTO>;
  //   createCheckoutSession(
  //     userId: string,
  //     planName: string,
  //     amount: number,
  //     currency: string
  //   ): Promise<string>;
  //   confirmPaymentSession(sessionId: string): Promise<ITransaction>;
  //   handleRefund(transactionId: string, reason: string): Promise<ITransaction>;
  //   getLatestSession(userId: string): Promise<ITransaction | null>;
  //   getTransactionDetails(sessionId: string): Promise<ITransaction>;
}

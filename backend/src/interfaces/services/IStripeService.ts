export interface IStripeService {
  createCheckoutSession(
    price: number,
    userId: string,
    metadata: any
  ): Promise<{ url: string }>;
  handleRefund(
    stripeSessionId: string,
    reason?: string
  ): Promise<{ message: string; refund: any }>;
  getLatestTransactionSession(userId: string): Promise<any>;
}

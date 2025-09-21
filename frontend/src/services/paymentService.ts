import apiAxios from "../utils/apiAxios";

export interface PaymentInfo {
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  sessionId: string;
  expiresAt: string;
  receiptUrl?: string;
}

export type PaymentResponse =
  | { message: "Payment already confirmed"; data: PaymentInfo }
  | { message: "Subscription activated successfully"; data: PaymentInfo }
  | { message: string; data?: PaymentInfo };

export const confirmPaymentSession = async (
  sessionId: string
): Promise<PaymentResponse> => {
  const res = await apiAxios.get(`/stripe/confirm-session/${sessionId}`);
  return res.data;
};

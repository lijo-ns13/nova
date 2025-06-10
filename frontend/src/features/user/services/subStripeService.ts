import userAxios from "../../../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/api/stripe`;

export interface StripeSessionRequest {
  userId: string;
  price: number;
  metadata: {
    planName: string;
    subscriptionType: string;
    userId: string;
  };
}

export interface StripeSessionResponse {
  url: string;
}

export interface RefundRequest {
  stripeSessionId: string;
  reason?: string;
}

export interface RefundSessionData {
  stripeSessionId: string;
  planName: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export const createCheckoutSession = async (
  data: StripeSessionRequest
): Promise<StripeSessionResponse> => {
  try {
    const result = await userAxios.post<StripeSessionResponse>(
      `${BASE_URL}/create-checkout-session`,
      data,
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.error("Create checkout session failed:", error);
    throw {
      message: getErrorMessage(error) || "Failed to create Stripe session",
    };
  }
};

export const getLatestSession = async (
  userId: string
): Promise<RefundSessionData> => {
  try {
    const result = await userAxios.get<RefundSessionData>(
      `${BASE_URL}/session/${userId}`,
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.error("Fetching Stripe session failed:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch session info",
    };
  }
};

export const requestRefund = async (
  data: RefundRequest
): Promise<{ message: string }> => {
  try {
    const result = await userAxios.post<{ message: string }>(
      `${BASE_URL}/refund`,
      data,
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.error("Refund failed:", error);
    throw {
      message: getErrorMessage(error) || "Refund request failed",
    };
  }
};

// Helper to extract error message
function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
  }
  return undefined;
}

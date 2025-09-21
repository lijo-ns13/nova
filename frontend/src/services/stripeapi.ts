import axios from "axios";
import apiAxios from "../utils/apiAxios";

export interface CreateCheckoutSessionInput {
  userId: string;
  price: number;
  metadata: {
    userId: string; // only if needed by Stripe Dashboard
    planName: string;
  };
}

export interface CreateCheckoutSessionSuccessResponse {
  url: string;
  sessionId?: string;
}

export interface CreateCheckoutSessionErrorResponse {
  error: string;
}

export const createCheckoutSession = async (
  userId: string,
  price: number,
  planName: string
): Promise<
  CreateCheckoutSessionSuccessResponse | CreateCheckoutSessionErrorResponse
> => {
  const payload: CreateCheckoutSessionInput = {
    userId,
    price,
    metadata: {
      userId,
      planName,
    },
  };

  try {
    const response = await apiAxios.post<CreateCheckoutSessionSuccessResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/stripe/create-checkout-session`,
      payload
    );

    return {
      url: response.data.url,
      sessionId: response.data.sessionId, // optional: if backend returns this
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return { error: error.response.data.message };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating checkout session.",
    };
  }
};

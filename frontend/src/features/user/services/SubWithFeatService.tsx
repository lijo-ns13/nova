import apiAxios from "../../../utils/apiAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/subfeat`;

export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

export interface SubscriptionWithFeaturesResponse {
  success: boolean;
  data: {
    subscription: {
      _id: string;
      name: string;
      price: number;
      validityDays: number;
      isActive: boolean;
      createdAt: string;
      updatedAt?: string;
    };
    features: string[];
  }[];
}

export const getAllSubscriptionWithFeature =
  async (): Promise<SubscriptionWithFeaturesResponse> => {
    try {
      const result = await apiAxios.get<SubscriptionWithFeaturesResponse>(
        BASE_URL,
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error("API Error:", error);
      if (isValidationError(error)) {
        throw error.response.data;
      }
      throw {
        message:
          getErrorMessage(error) ||
          "Failed to fetch subscriptions with features",
      } as HTTPErrorResponse;
    }
  };

// Type guard for validation errors
function isValidationError(
  error: unknown
): error is { response: { data: ValidationErrorResponse } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data?.errors === "object"
  );
}

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

import adminAxios from "../../../utils/adminAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/subscription`;

export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

interface SubscriptionPlanData {
  name: string;
  price: number;
  validityDays: number;
  isActive?: boolean;
}

interface SubscriptionPlanResponse {
  _id: string;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface UpdatePlanData {
  price?: number;
  validityDays?: number;
  isActive?: boolean;
}

// Create a new subscription plan
export const CreateSubscriptionPlan = async (
  data: SubscriptionPlanData
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.post<SubscriptionPlanResponse>(
      BASE_URL,
      data,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    if (isValidationError(error)) {
      throw error.response.data;
    }
    throw {
      message: getErrorMessage(error) || "Failed to create subscription plan",
    } as HTTPErrorResponse;
  }
};

// Get all subscription plans
export const GetAllSubscription = async (): Promise<
  SubscriptionPlanResponse[]
> => {
  try {
    const result = await adminAxios.get<SubscriptionPlanResponse[]>(BASE_URL, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch subscription plans",
    } as HTTPErrorResponse;
  }
};

// Delete a subscription plan
export const DeleteSubscription = async (subId: string): Promise<boolean> => {
  try {
    await adminAxios.delete(`${BASE_URL}/${subId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to delete subscription plan",
    } as HTTPErrorResponse;
  }
};

// Get a subscription plan by ID
export const GetPlanById = async (
  subId: string
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.get<SubscriptionPlanResponse>(
      `${BASE_URL}/${subId}`,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch subscription plan",
    } as HTTPErrorResponse;
  }
};

// Toggle plan status (active/inactive)
export const TogglePlanStatus = async (
  subId: string,
  isActive: boolean
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.patch<SubscriptionPlanResponse>(
      `${BASE_URL}/${subId}/status`,
      { isActive },
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message:
        getErrorMessage(error) || "Failed to toggle subscription plan status",
    } as HTTPErrorResponse;
  }
};

// Update a subscription plan
export const UpdateSubscriptionPlan = async (
  subId: string,
  updates: UpdatePlanData
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.put<SubscriptionPlanResponse>(
      `${BASE_URL}/${subId}`,
      updates,
      { withCredentials: true }
    );
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    if (isValidationError(error)) {
      throw error.response.data;
    }
    throw {
      message: getErrorMessage(error) || "Failed to update subscription plan",
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

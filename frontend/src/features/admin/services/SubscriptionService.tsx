import { APIResponse } from "../../../types/api";
import {
  CreatePlanInput,
  SubscriptionPlanResponse,
  UpdatePlanInput,
} from "../types/subscription";
import { handleApiError } from "../../../utils/apiError";
import z from "zod";
import apiAxios from "../../../utils/apiAxios";
export const TRANSACTION_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export const transactionFilterSchema = z
  .object({
    status: z.enum(TRANSACTION_STATUSES).optional(),
    planName: z.string().min(1).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    userId: z.string().length(24).optional(),
    isActiveOnly: z.enum(["true", "false"]).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  })
  .strict(); // Disallow extra unexpected query fields

export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;

export interface TransactionResponseDTO {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  stripeSessionId: string;
  stripeRefundId: string | null;
  planName: string;
  refundReason: string | null;
  refundDate: string | null;
  createdAt: string;
}

export interface TransactionListWithPagination {
  transactions: TransactionResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/subscription`;
export const GetFilteredTransactions = async (
  filters: TransactionFilterInput
): Promise<TransactionListWithPagination> => {
  try {
    const result = await apiAxios.get<
      APIResponse<TransactionListWithPagination>
    >(`${BASE_URL}/transactions`, {
      params: filters,
      withCredentials: true,
    });
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch transactions");
  }
};
// Create a new subscription plan
export const CreateSubscriptionPlan = async (
  data: CreatePlanInput
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await apiAxios.post<APIResponse<SubscriptionPlanResponse>>(
      BASE_URL,
      data,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create subscription plan");
  }
};

// Get all subscription plans
export const GetAllSubscription = async (): Promise<
  SubscriptionPlanResponse[]
> => {
  try {
    const result = await apiAxios.get<APIResponse<SubscriptionPlanResponse[]>>(
      BASE_URL,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch subscription plans");
  }
};

// Delete a subscription plan
export const DeleteSubscription = async (subId: string): Promise<boolean> => {
  try {
    await apiAxios.delete(`${BASE_URL}/${subId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    throw handleApiError(error, "Failed to delete subscription plan");
  }
};

// Get a subscription plan by ID
export const GetPlanById = async (
  subId: string
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await apiAxios.get<APIResponse<SubscriptionPlanResponse>>(
      `${BASE_URL}/${subId}`,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch subscription plan");
  }
};

// Toggle plan status
export const TogglePlanStatus = async (
  subId: string,
  isActive: boolean
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await apiAxios.patch<APIResponse<SubscriptionPlanResponse>>(
      `${BASE_URL}/${subId}/status`,
      { isActive },
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to toggle subscription plan status");
  }
};

// Update a subscription plan
export const UpdateSubscriptionPlan = async (
  subId: string,
  updates: UpdatePlanInput
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await apiAxios.put<APIResponse<SubscriptionPlanResponse>>(
      `${BASE_URL}/${subId}`,
      updates,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update subscription plan");
  }
};

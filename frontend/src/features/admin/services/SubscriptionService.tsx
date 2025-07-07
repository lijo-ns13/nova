import adminAxios from "../../../utils/adminAxios";
import { APIResponse, HTTPErrorResponse } from "../../../types/api";
import {
  CreatePlanInput,
  SubscriptionPlanResponse,
  UpdatePlanInput,
} from "../types/subscription";
import { handleApiError } from "../../../utils/apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/subscription`;

// Create a new subscription plan
export const CreateSubscriptionPlan = async (
  data: CreatePlanInput
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.post<APIResponse<SubscriptionPlanResponse>>(
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
    const result = await adminAxios.get<
      APIResponse<SubscriptionPlanResponse[]>
    >(BASE_URL, { withCredentials: true });
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch subscription plans");
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
    throw handleApiError(error, "Failed to delete subscription plan");
  }
};

// Get a subscription plan by ID
export const GetPlanById = async (
  subId: string
): Promise<SubscriptionPlanResponse> => {
  try {
    const result = await adminAxios.get<APIResponse<SubscriptionPlanResponse>>(
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
    const result = await adminAxios.patch<
      APIResponse<SubscriptionPlanResponse>
    >(`${BASE_URL}/${subId}/status`, { isActive }, { withCredentials: true });
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
    const result = await adminAxios.put<APIResponse<SubscriptionPlanResponse>>(
      `${BASE_URL}/${subId}`,
      updates,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update subscription plan");
  }
};

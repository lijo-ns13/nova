import adminAxios from "../../../utils/adminAxios";
import {
  FeatureResponse,
  FeatureInput,
  UpdateFeatureInput,
} from "../types/feature";
import { APIResponse, HTTPErrorResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/feature`;

export const FeatureService = {
  async createFeature(data: FeatureInput): Promise<FeatureResponse> {
    try {
      const result = await adminAxios.post<APIResponse<FeatureResponse>>(
        BASE_URL,
        data,
        { withCredentials: true }
      );
      return result.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create feature");
    }
  },

  async getAllFeatures(): Promise<FeatureResponse[]> {
    try {
      const result = await adminAxios.get<APIResponse<FeatureResponse[]>>(
        BASE_URL,
        { withCredentials: true }
      );
      return result.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch features");
    }
  },

  async getFeatureById(id: string): Promise<FeatureResponse> {
    try {
      const result = await adminAxios.get<APIResponse<FeatureResponse>>(
        `${BASE_URL}/${id}`,
        { withCredentials: true }
      );
      return result.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch feature");
    }
  },

  async updateFeature(
    id: string,
    updates: UpdateFeatureInput
  ): Promise<FeatureResponse> {
    try {
      const result = await adminAxios.put<APIResponse<FeatureResponse>>(
        `${BASE_URL}/${id}`,
        updates,
        { withCredentials: true }
      );
      return result.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update feature");
    }
  },

  async deleteFeature(id: string): Promise<boolean> {
    try {
      await adminAxios.delete(`${BASE_URL}/${id}`, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      throw handleApiError(error, "Failed to delete feature");
    }
  },
};

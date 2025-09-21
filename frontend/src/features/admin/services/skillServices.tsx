import {
  ISkill,
  CreateSkillDto,
  UpdateSkillDto,
  PaginatedSkillResponse,
  SkillWithCreatorEmail,
} from "../types/skills";
import { APIResponse, HTTPErrorResponse } from "../../../types/api";
import { getErrorMessage, handleApiError } from "../../../utils/apiError";
import apiAxios from "../../../utils/apiAxios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/admin/skills`;

export const SkillService = {
  async createSkill(data: CreateSkillDto): Promise<ISkill> {
    try {
      const response = await apiAxios.post<APIResponse<ISkill>>(
        BASE_URL,
        data,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create skill");
    }
  },

  async getSkills(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedSkillResponse> {
    try {
      const response = await apiAxios.get<{
        success: boolean;
        data: ISkill[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(BASE_URL, {
        params: { page, limit, search },
        withCredentials: true,
      });

      const { data, pagination } = response.data;

      return {
        skills: data, // ✅ Fix: rename `data` → `skills`
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
      };
    } catch (error) {
      throw handleApiError(error, "Failed to fetch skills");
    }
  },
  async getSkillById(id: string): Promise<SkillWithCreatorEmail> {
    try {
      const response = await apiAxios.get<APIResponse<SkillWithCreatorEmail>>(
        `${BASE_URL}/${id}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch skill");
    }
  },

  async updateSkill(id: string, data: UpdateSkillDto): Promise<ISkill> {
    try {
      const response = await apiAxios.patch<APIResponse<ISkill>>(
        `${BASE_URL}/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update skill");
    }
  },

  async deleteSkill(id: string): Promise<void> {
    try {
      await apiAxios.delete(`${BASE_URL}/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw handleApiError(error, "Failed to delete skill");
    }
  },
};

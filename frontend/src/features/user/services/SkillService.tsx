import apiAxios from "../../../utils/apiAxios";

// ✅ API base setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}`;

// ✅ Interfaces
export interface Skill {
  id: string;
  title: string;
  createdById?: string;
  createdBy?: "user" | "company" | "admin";
}

export interface UserSkill {
  id: string;
  title: string;
}

// ✅ Reusable generic for standard API response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface BasicResponse {
  success: boolean;
  message?: string;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

// ✅ Utility for consistent error extraction
export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    if (maybeError.response?.data?.message)
      return maybeError.response.data.message;
    if (maybeError.response?.data?.error) return maybeError.response.data.error;
    if (maybeError.message) return maybeError.message;
  }

  return "An unknown error occurred";
}

// ✅ DRY throw helper
function throwHandled(error: unknown, fallback: string): never {
  throw {
    message: getErrorMessage(error) || fallback,
  } as HTTPErrorResponse;
}

// ✅ Search Skills
export const searchSkills = async (query: string): Promise<string[]> => {
  try {
    const response = await apiAxios.get<ApiResponse<{ title: string }[]>>(
      `${BASE_URL}/skill/search`,
      { params: { q: query } }
    );
    return response.data.data.map((skill) => skill.title);
  } catch (error) {
    throwHandled(error, "Failed to search skills");
  }
};

// ✅ Add Skill
export const addSkill = async (
  title: string
): Promise<{ skills: UserSkill[]; message?: string }> => {
  try {
    const response = await apiAxios.post<ApiResponse<UserSkill[]>>(
      `${BASE_URL}/userskills`,
      { title }
    );
    return {
      skills: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    throwHandled(error, "Failed to add skill");
  }
};

// ✅ Remove Skill
export const removeSkill = async (skillId: string): Promise<string> => {
  try {
    const response = await apiAxios.delete<BasicResponse>(
      `${BASE_URL}/userskills/${skillId}`
    );
    return response.data.message || "Skill removed";
  } catch (error) {
    throwHandled(error, "Failed to remove skill");
  }
};

// ✅ Get User Skills
export const getUserSkills = async (): Promise<UserSkill[]> => {
  try {
    const response = await apiAxios.get<ApiResponse<UserSkill[]>>(
      `${BASE_URL}/userskills/user`
    );
    return response.data.data;
  } catch (error) {
    throwHandled(error, "Failed to fetch user skills");
  }
};

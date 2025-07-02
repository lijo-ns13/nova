import userAxios from "../../../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/skill`;

export interface Skill {
  _id: string;
  title: string;
  createdById?: string;
  createdBy?: "user" | "company" | "admin";
}

export interface SkillResponse {
  success: boolean;
  data: Skill[];
}

export interface BasicResponse {
  success: boolean;
  message?: string;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}
export interface UserSkill {
  _id: string;
  title: string;
}

export interface UserSkillsResponse {
  success: boolean;
  data: UserSkill[];
}
export const searchSkills = async (query: string): Promise<string[]> => {
  try {
    const response = await userAxios.get<string[]>(`${BASE_URL}/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error) || "Failed to search skills",
    } as HTTPErrorResponse;
  }
};
export const addSkill = async (title: string): Promise<BasicResponse> => {
  try {
    const response = await userAxios.post<BasicResponse>(`${BASE_URL}`, {
      title,
    });
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error) || "Failed to add skill",
    } as HTTPErrorResponse;
  }
};
export const removeSkill = async (skillId: string): Promise<BasicResponse> => {
  try {
    const response = await userAxios.delete<BasicResponse>(`${BASE_URL}`, {
      data: { skillId },
    });
    return response.data;
  } catch (error) {
    throw {
      message: getErrorMessage(error) || "Failed to remove skill",
    } as HTTPErrorResponse;
  }
};
export const getUserSkills = async (): Promise<UserSkill[]> => {
  try {
    const response = await userAxios.get<UserSkillsResponse>(
      `${BASE_URL}/user`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user skills:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch user skills",
    } as HTTPErrorResponse;
  }
};
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as Partial<AxiosErrorResponse>;

    if (maybeError.response?.data?.message)
      return maybeError.response.data.message;
    if (maybeError.response?.data?.error) return maybeError.response.data.error;
    if (maybeError.message) return maybeError.message;
  }

  return "An unknown error occurred";
}

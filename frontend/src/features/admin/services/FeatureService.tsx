import adminAxios from "../../../utils/adminAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/feature`;

export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

export interface FeatureData {
  name: string;
}

export interface FeatureResponse {
  _id: string;
  name: string;

  createdAt: string;
  updatedAt?: string;
}

export interface UpdateFeatureData {
  name?: string;
}

export const createFeature = async (
  data: FeatureData
): Promise<FeatureResponse> => {
  try {
    const result = await adminAxios.post<FeatureResponse>(BASE_URL, data, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    if (isValidationError(error)) {
      throw error.response.data;
    }
    throw {
      message: getErrorMessage(error) || "Failed to create feature",
    } as HTTPErrorResponse;
  }
};

export const getAllFeatures = async (): Promise<FeatureResponse[]> => {
  try {
    const result = await adminAxios.get<FeatureResponse[]>(BASE_URL, {
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch features",
    } as HTTPErrorResponse;
  }
};

export const deleteFeature = async (featureId: string): Promise<boolean> => {
  try {
    await adminAxios.delete(`${BASE_URL}/${featureId}`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to delete feature",
    } as HTTPErrorResponse;
  }
};

export const getFeatureById = async (
  featureId: string
): Promise<FeatureResponse> => {
  try {
    const result = await adminAxios.get<FeatureResponse>(
      `${BASE_URL}/${featureId}`,
      {
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch feature",
    } as HTTPErrorResponse;
  }
};

export const updateFeature = async (
  featureId: string,
  updates: UpdateFeatureData
): Promise<FeatureResponse> => {
  try {
    const result = await adminAxios.put<FeatureResponse>(
      `${BASE_URL}/${featureId}`,
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
      message: getErrorMessage(error) || "Failed to update feature",
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

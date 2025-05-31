export interface Feature {
  _id: string;
  name: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FeatureFormData {
  name: string;
}

export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

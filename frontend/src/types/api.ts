export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

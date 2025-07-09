// Generic API success wrapper
export interface APIResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Field-level validation error (Zod-style or similar)
export interface ValidationErrorResponse {
  success: false;
  errors: Record<string, string>;
  message?: string;
}

// Generic failure response
export interface HTTPErrorResponse {
  success: false;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Output format after parsing any API error
export interface ParsedAPIError {
  message?: string;
  errors?: Record<string, string>;
  statusCode: number;
}

import axios, { AxiosError } from "axios";
import { HTTPErrorResponse, ValidationErrorResponse } from "../types/api";

export type ParsedAPIError = {
  message?: string;
  errors?: Record<string, string>;
  statusCode: number;
};

export function isValidationError(
  error: unknown
): error is AxiosError<ValidationErrorResponse> {
  return (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.errors === "object"
  );
}

export function getErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return undefined;
}

export function handleApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
): ParsedAPIError {
  const statusCode =
    axios.isAxiosError(error) && error.response?.status
      ? error.response.status
      : 500;

  if (isValidationError(error)) {
    return {
      statusCode,
      errors: error.response!.data.errors, // ✅ field-level
    };
  }

  return {
    statusCode,
    message: getErrorMessage(error) || fallbackMessage,
  };
}

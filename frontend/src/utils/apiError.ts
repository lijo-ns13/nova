import axios, { AxiosError } from "axios";
import {
  HTTPErrorResponse,
  ValidationErrorResponse,
  ParsedAPIError,
} from "../types/api";

// ✅ Type guard: Checks for validation error structure
export function isValidationError(
  error: unknown
): error is AxiosError<ValidationErrorResponse> {
  return (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === "object" &&
    "errors" in error.response.data &&
    typeof error.response.data.errors === "object"
  );
}

// ✅ Safely extracts a readable error message
export function getErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }

      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
    }

    return error.message || "An unknown Axios error occurred";
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as { error: unknown }).error === "string"
  ) {
    return (error as { error: string }).error;
  }

  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  return undefined;
}

// ✅ Final handler that returns consistent structure
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
      errors: error.response!.data.errors,
      message: getErrorMessage(error), // optional but helpful
    };
  }

  return {
    statusCode,
    message: getErrorMessage(error) || fallbackMessage,
  };
}

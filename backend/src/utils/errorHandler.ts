import { Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import logger from "./logger";

export function handleControllerError(
  error: unknown,
  res: Response,
  context?: string
): void {
  const logPrefix = context ? `[${context}]` : "[ErrorHandler]";

  if (error instanceof ZodError) {
    const errors = Object.fromEntries(
      error.errors.map((e) => [e.path.join("."), e.message])
    );

    logger.warn(`${logPrefix} Validation failed`, errors);

    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors,
    });
  } else {
    logger.error(`${logPrefix} Unexpected error`, error);

    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: (error as Error).message,
    });
  }
}

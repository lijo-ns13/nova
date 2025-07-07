import { Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import logger from "./logger";

type MongoDuplicateError = {
  code: 11000;
  keyPattern: Record<string, number>;
  keyValue: Record<string, unknown>;
  message: string;
};

export function handleControllerError(
  error: unknown,
  res: Response,
  context?: string
): void {
  const logPrefix = context ? `[${context}]` : "[ErrorHandler]";

  // ✅ Zod error
  if (error instanceof ZodError) {
    const errors = Object.fromEntries(
      error.errors.map((e) => [e.path.join("."), e.message])
    );

    logger.warn(`${logPrefix} Zod validation failed`, { errors });

    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors,
    });
    return;
  }

  // ✅ Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    for (const [field, errObj] of Object.entries(error.errors)) {
      errors[field] = (errObj as mongoose.Error.ValidatorError).message;
    }

    logger.warn(`${logPrefix} Mongoose validation failed`, { errors });

    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      success: false,
      errors,
    });
    return;
  }

  // ✅ MongoDB duplicate key error
  if (isMongoDuplicateKeyError(error)) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue?.[field];

    logger.warn(`${logPrefix} Duplicate key error`, { field, value });

    res.status(HTTP_STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // ❌ Unknown or unhandled error
  logger.error(`${logPrefix} Unexpected error`, error);

  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error instanceof Error ? error.message : "Internal server error",
  });
}

// ✅ Narrow type-check helper
function isMongoDuplicateKeyError(err: unknown): err is MongoDuplicateError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as Record<string, unknown>).code === 11000 &&
    "keyPattern" in err &&
    "keyValue" in err
  );
}

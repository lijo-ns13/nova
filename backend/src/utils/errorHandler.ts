import { Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";

export function handleControllerError(error: unknown, res: Response): void {
  if (error instanceof ZodError) {
    const errors = Object.fromEntries(
      error.errors.map((e) => [e.path.join("."), e.message])
    );
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ success: false, errors });
  } else {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: (error as Error).message,
    });
  }
}

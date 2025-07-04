import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, originalUrl } = req;
  const start = Date.now();

  res.on("finish", () => {
    const { statusCode } = res;
    const duration = Date.now() - start;
    logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
};

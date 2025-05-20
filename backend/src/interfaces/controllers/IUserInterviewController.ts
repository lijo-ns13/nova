import { Request, Response, NextFunction } from "express";

export interface IUserInterviewController {
  updateInterviewStatus(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
}

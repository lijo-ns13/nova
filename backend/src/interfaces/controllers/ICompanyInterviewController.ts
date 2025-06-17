// src/interfaces/controllers/ICompanyInterviewController.ts
import { Request, Response, NextFunction } from "express";

export interface ICompanyInterviewController {
  createInterview(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
  getUpcomingAcceptedInterviews(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
}

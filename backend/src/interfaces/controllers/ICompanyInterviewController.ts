// src/interfaces/controllers/ICompanyInterviewController.ts
import { Request, Response, NextFunction } from "express";

export interface ICompanyInterviewController {
  createInterview(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
  getCompanyInterviews(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
  getApplicantDetails(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
}

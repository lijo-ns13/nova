// src/interfaces/controllers/IJobApplicantManagementController.ts

import { Request, Response, NextFunction } from "express";

export interface IJobApplicantManagementController {
  // getApplicationsByJob(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void>;
  // getApplicationsByUser(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void>;
  getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  // createApplication(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void>;
  updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

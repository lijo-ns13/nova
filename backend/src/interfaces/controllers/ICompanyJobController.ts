// src/core/interfaces/controllers/IJobController.ts

import { RequestHandler, Request, Response } from "express";

export interface ICompanyJobController {
  createJob: RequestHandler;
  updateJob: RequestHandler;
  deleteJob: RequestHandler;
  getJobs: RequestHandler;
  getJob: RequestHandler;
  getApplications(req: Request, res: Response): Promise<void>;
  shortlistApplication(req: Request, res: Response): Promise<void>;
  rejectApplication(req: Request, res: Response): Promise<void>;
  getApplicantDetails(req: Request, res: Response): Promise<void>;
}

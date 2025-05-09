// src/core/interfaces/controllers/IJobController.ts

import { RequestHandler } from "express";

export interface ICompanyJobController {
  createJob: RequestHandler;
  updateJob: RequestHandler;
  deleteJob: RequestHandler;
  getJobs: RequestHandler;
  getJobApplications: RequestHandler;
  getJob: RequestHandler;
}

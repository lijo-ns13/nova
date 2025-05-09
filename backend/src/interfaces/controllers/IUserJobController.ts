import { RequestHandler } from "express";

export interface IUserJobController {
  getAllJobs: RequestHandler;
  getJob: RequestHandler;
  applyToJob: RequestHandler;
  getSavedJobs: RequestHandler;
  getAppliedJobs: RequestHandler;
  saveJob: RequestHandler;
  unsaveJob: RequestHandler;
}

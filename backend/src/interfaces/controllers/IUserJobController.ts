import { RequestHandler, Request, Response } from "express";

export interface IUserJobController {
  getAllJobs: RequestHandler;
  getJob: RequestHandler;
  applyToJob: RequestHandler;
  getAppliedJobs: RequestHandler;
  checkApplicationStatus: RequestHandler;
}

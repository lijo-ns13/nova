// src/controllers/JobApplicantManagementController.ts

import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ZodError } from "zod";
import { IJobApplicantManagementController } from "../../interfaces/controllers/IJobApplicantManagementController";
import { IJobApplicantManagementService } from "../../interfaces/services/IJobApplicantManagement";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ApplicationStatus } from "../../models/application.modal";

// Helper to format Zod errors
const formatZodError = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return errors;
};

@injectable()
export class JobApplicantManagementController
  implements IJobApplicantManagementController
{
  constructor(
    @inject(TYPES.JobApplicantManagementService)
    private jobApplicantManagementService: IJobApplicantManagementService
  ) {}

  async getApplicationsByJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const applications =
        await this.jobApplicantManagementService.getApplicationsByJob(jobId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, data: applications });
    } catch (error) {
      console.log("error form here", error);
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ succuss: false, message: (error as Error).message });
    }
  }

  async getApplicationsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const applications =
        await this.jobApplicantManagementService.getApplicationsByUser(userId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, data: applications });
    } catch (error) {
      console.log("error form here", error);
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ succuss: false, message: (error as Error).message });
    }
  }

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const application =
        await this.jobApplicantManagementService.getApplicationWithDetails(
          applicationId
        );
      if (!application) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: "Application not found" });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, data: application });
    } catch (error) {
      console.log("error form here", error);
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ succuss: false, message: (error as Error).message });
    }
  }

  async createApplication(req: Request, res: Response): Promise<void> {
    try {
      const { job, user, resumeMediaId } = req.body;
      const application =
        await this.jobApplicantManagementService.createApplication({
          job,
          user,
          resumeMediaId,
        });
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ success: true, data: application });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: formatZodError(error) });
      } else {
        console.log("error form here", error);
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ succuss: false, message: (error as Error).message });
      }
    }
  }

  async updateApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { status, reason } = req.body;
      if (!status) {
        throw new Error("sttatu control not found");
      }
      const updated =
        await this.jobApplicantManagementService.updateApplicationStatus(
          applicationId,
          status as ApplicationStatus,
          reason
        );

      if (!updated) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Application not found" });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: updated });
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: formatZodError(error) });
      } else {
        console.log("error form here", error);
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ succuss: false, message: (error as Error).message });
      }
    }
  }
}

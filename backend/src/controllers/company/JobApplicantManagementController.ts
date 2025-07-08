// src/controllers/JobApplicantManagementController.ts

import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ZodError } from "zod";
import { IJobApplicantManagementController } from "../../interfaces/controllers/IJobApplicantManagementController";
import { IJobApplicantManagementService } from "../../interfaces/services/IJobApplicantManagement";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ApplicationStatus } from "../../models/application.modal";
import { handleControllerError } from "../../utils/errorHandler";
import {
  ApplicationMapper,
  UpdateApplicationStatusSchema,
} from "../../mapping/company/applicant/aplicationtwo.mapper";

@injectable()
export class JobApplicantManagementController
  implements IJobApplicantManagementController
{
  constructor(
    @inject(TYPES.JobApplicantManagementService)
    private jobApplicantManagementService: IJobApplicantManagementService
  ) {}

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const result =
        await this.jobApplicantManagementService.getApplicationWithDetails(
          applicationId
        );
      if (!result) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Application not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "GetApplicationById");
    }
  }

  async updateApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const parsed = UpdateApplicationStatusSchema.parse(req.body);
      const updated =
        await this.jobApplicantManagementService.updateApplicationStatus(
          applicationId,
          parsed.status,
          parsed.reason
        );

      if (!updated) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Application not found",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Status updated successfully",
        data: ApplicationMapper.toDTO(updated),
      });
    } catch (error) {
      handleControllerError(error, res, "UpdateApplicationStatus");
    }
  }
  // async getApplicationsByJob(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { jobId } = req.params;
  //     const applications =
  //       await this.jobApplicantManagementService.getApplicationsByJob(jobId);
  //     res
  //       .status(HTTP_STATUS_CODES.OK)
  //       .json({ success: true, data: applications });
  //   } catch (error) {
  //     console.log("error form here", error);
  //     res
  //       .status(HTTP_STATUS_CODES.BAD_REQUEST)
  //       .json({ succuss: false, message: (error as Error).message });
  //   }
  // }

  // async getApplicationsByUser(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { userId } = req.params;
  //     const applications =
  //       await this.jobApplicantManagementService.getApplicationsByUser(userId);
  //     res
  //       .status(HTTP_STATUS_CODES.OK)
  //       .json({ success: true, data: applications });
  //   } catch (error) {
  //     console.log("error form here", error);
  //     res
  //       .status(HTTP_STATUS_CODES.BAD_REQUEST)
  //       .json({ succuss: false, message: (error as Error).message });
  //   }
  // }
  // async createApplication(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { job, user, resumeMediaId } = req.body;
  //     const application =
  //       await this.jobApplicantManagementService.createApplication({
  //         job,
  //         user,
  //         resumeMediaId,
  //       });
  //     res
  //       .status(HTTP_STATUS_CODES.CREATED)
  //       .json({ success: true, data: application });
  //   } catch (error) {
  //     if (error instanceof ZodError) {
  //       res
  //         .status(HTTP_STATUS_CODES.BAD_REQUEST)
  //         .json({ success: false, errors: formatZodError(error) });
  //     } else {
  //       console.log("error form here", error);
  //       res
  //         .status(HTTP_STATUS_CODES.BAD_REQUEST)
  //         .json({ succuss: false, message: (error as Error).message });
  //     }
  //   }
  // }
}

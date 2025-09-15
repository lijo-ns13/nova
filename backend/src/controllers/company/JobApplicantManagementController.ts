import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IJobApplicantManagementController } from "../../interfaces/controllers/IJobApplicantManagementController";
import { IJobApplicantManagementService } from "../../interfaces/services/IJobApplicantManagement";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
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
    private _jobApplicantManagementService: IJobApplicantManagementService
  ) {}

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const result =
        await this._jobApplicantManagementService.getApplicationWithDetails(
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
        await this._jobApplicantManagementService.updateApplicationStatus(
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
}

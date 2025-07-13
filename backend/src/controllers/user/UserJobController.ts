import { Request, RequestHandler, Response } from "express";

import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserJobController } from "../../interfaces/controllers/IUserJobController";
import { handleControllerError } from "../../utils/errorHandler";
import { GetAllJobsQuerySchema } from "../../core/validations/user/user.jobschema";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class UserJobController implements IUserJobController {
  constructor(
    @inject(TYPES.UserJobService) private jobService: IUserJobService
  ) {}
  getAllJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const query = GetAllJobsQuerySchema.parse(req.query);

      const result = await this.jobService.getAllJobs(query);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Jobs fetched successfully",
        data: {
          jobs: result.jobs,
          pagination: {
            page: query.page,
            limit: query.limit,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      handleControllerError(error, res, "UserJobController.getAllJobs");
    }
  };
  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const job = await this.jobService.getJob(jobId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Job fetched successfully",
        data: job, // already mapped via toResponseWithSkillDto
      });
    } catch (error) {
      handleControllerError(error, res, "UserJobController.getJob");
    }
  };
  getAppliedJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const user = req.user as UserPayload;
      const data = await this.jobService.getAppliedJobs(user.id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Applied jobs fetched successfully",
        data,
      });
    } catch (error) {
      handleControllerError(error, res, "UserJobController.getAppliedJobs");
    }
  };

  applyToJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const userId = (req.user as { id: string })?.id;
      const resumeFile = req.file as Express.Multer.File;

      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
          data: false,
        });
        return;
      }

      if (!resumeFile) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Resume file is required",
          data: false,
        });
        return;
      }

      if (resumeFile.mimetype !== "application/pdf") {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Only PDF files are accepted for resumes",
          data: false,
        });
        return;
      }

      await this.jobService.applyToJob(jobId, userId, resumeFile);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Job application submitted successfully",
        data: true,
      });
    } catch (error) {
      handleControllerError(error, res, "JobApplicationController.applyToJob");
    }
  };

  checkApplicationStatus: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { jobId } = req.params;
      const userId = (req.user as UserPayload)?.id;

      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const hasApplied = await this.jobService.hasApplied(jobId, userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Application status retrieved successfully",
        data: hasApplied,
      });
    } catch (error) {
      handleControllerError(error, res, "checkApplicationStatus");
    }
  };
}

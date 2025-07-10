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
        data: result.jobs,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      handleControllerError(error, res, "UserJobController.getAllJobs");
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

  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const job = await this.jobService.getJob(jobId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Job fetched successfully",
        data: job,
      });
    } catch (error) {
      handleControllerError(error, res, "UserJobController.getJob");
    }
  };
  applyToJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const userId = (req.user as UserPayload)?.id;
      const resumeFile = req.file as Express.Multer.File; // Changed from resumeUrl to file

      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated or user ID missing",
        });
        return;
      }

      if (!resumeFile) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Resume file is required",
        });
        return;
      }

      // Optional: Validate file type
      if (resumeFile.mimetype !== "application/pdf") {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Only PDF files are accepted for resumes",
        });
        return;
      }

      const application = await this.jobService.applyToJob(
        jobId,
        userId,
        resumeFile
      );

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        data: application,
      });
    } catch (error) {
      console.error("Error in applyToJob:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
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
        data: { hasApplied },
      });
    } catch (error) {
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  // ****
  saveJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const user = req.user as UserPayload;
      await this.jobService.addToSavedJobs(user.id, jobId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Job saved successfully" });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };

  unsaveJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const user = req.user as UserPayload;
      await this.jobService.removeFromSavedJobs(user.id, jobId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Job removed from saved jobs" });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };
  getSavedJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const user = req.user as UserPayload;
      if (!user) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, messge: "user id is not ofund" });
        return;
      }
      const savedJobs = await this.jobService.getSavedJobs(user.id);
      console.log("savedJobs", savedJobs);
      res.status(HTTP_STATUS_CODES.OK).json(savedJobs);
    } catch (error) {
      console.log("errror in savedjbos get", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };
}

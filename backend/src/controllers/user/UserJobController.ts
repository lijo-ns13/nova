import { Request, RequestHandler, Response } from "express";

import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserJobController } from "../../interfaces/controllers/IUserJobController";
import { handleControllerError } from "../../utils/errorHandler";
import { GetAllJobsQuerySchema } from "../../core/validations/user/user.jobschema";
import { UserPayload } from "../../constants/userPayload";
import {
  COMMON_MESSAGES,
  USER_MESSAGES,
} from "../../constants/message.constants";

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
        message: USER_MESSAGES.JOB.SUCCESS.JOB_ALL_FETCH,
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
      handleControllerError(
        error,
        res,
        USER_MESSAGES.JOB.ERROR.FAILED_JOBALLFETCH
      );
    }
  };
  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const job = await this.jobService.getJob(jobId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.JOB.SUCCESS.JOB_FETCH,
        data: job,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.JOB.ERROR.FAILED_JOBFETCH
      );
    }
  };
  getAppliedJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const user = req.user as UserPayload;
      const data = await this.jobService.getAppliedJobs(user.id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.JOB.SUCCESS.APPLIED_JOB_FETCH,
        data,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.JOB.ERROR.FAILED_APPLIEDJOBFETCH
      );
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
          message: COMMON_MESSAGES.NOT_AUTHORIZED,
          data: false,
        });
        return;
      }

      if (!resumeFile) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: COMMON_MESSAGES.RESUME_FILE_REQUIRED,
          data: false,
        });
        return;
      }

      if (resumeFile.mimetype !== "application/pdf") {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: COMMON_MESSAGES.ONLY_PDF,
          data: false,
        });
        return;
      }

      await this.jobService.applyToJob(jobId, userId, resumeFile);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: USER_MESSAGES.JOB.SUCCESS.APPLY_JOB,
        data: true,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.JOB.ERROR.FAILED_JOBAPPLY
      );
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
          message: COMMON_MESSAGES.NOT_AUTHORIZED,
        });
        return;
      }

      const hasApplied = await this.jobService.hasApplied(jobId, userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: USER_MESSAGES.JOB.SUCCESS.CHECK_APPLICATION_STATUS,
        data: hasApplied,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        USER_MESSAGES.JOB.ERROR.FAILED_CHECK_APPLICATION_STATUS
      );
    }
  };
}

import { Request, RequestHandler, Response } from "express";

import { IUserJobService } from "../../../../core/interfaces/services/IUserJobService";
import { TYPES } from "../../../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { IUserJobController } from "../../../../core/interfaces/controllers/IUserJobController";

interface Userr {
  id: string;
  email: string;
  role: string;
}

// 8*88888
export class UserJobController implements IUserJobController {
  constructor(
    @inject(TYPES.UserJobService) private jobService: IUserJobService
  ) {}
  getAllJobs: RequestHandler = async (_req: Request, res: Response) => {
    try {
      const jobs = await this.jobService.getAllJobs();
      console.log("jobs", jobs);
      res.status(HTTP_STATUS_CODES.OK).json(jobs);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };
  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = await this.jobService.getJob(jobId);
      console.log("jobs", job);
      res.status(HTTP_STATUS_CODES.OK).json(job);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };
  applyToJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const userId = (req.user as Userr)?.id; // Assuming auth middleware adds req.user

      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: "User not authenticated or user ID missing" });
        return;
      }

      const { resumeUrl } = req.body;

      if (!resumeUrl) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Resume URL is required" });
        return;
      }

      const updatedJob = await this.jobService.applyToJob(
        jobId,
        userId,
        resumeUrl
      );
      res.status(HTTP_STATUS_CODES.OK).json(updatedJob);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };
  getSavedJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const user = req.user as Userr;
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

  getAppliedJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const user = req.user as Userr;
      const appliedJobs = await this.jobService.getAppliedJobs(user.id);
      res.status(HTTP_STATUS_CODES.OK).json(appliedJobs);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  };

  saveJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const user = req.user as Userr;
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
      const user = req.user as Userr;
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
}

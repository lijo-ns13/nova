// src/modules/job/controllers/JobController.ts

import { Request, Response, RequestHandler } from "express";

import { ZodError } from "zod";
import { TYPES } from "../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import skillModal from "../../models/skill.modal";
import {
  createJobSchema,
  updateJobSchema,
} from "../../core/dtos/company/job.validation.dto";
import { ICompanyJobService } from "../../interfaces/services/ICompanyJobService";
import { ICompanyJobController } from "../../interfaces/controllers/ICompanyJobController";
interface Userr {
  id: string;
  email: string;
  role: string;
}
export class CompanyJobController implements ICompanyJobController {
  constructor(
    @inject(TYPES.CompanyJobService) private jobService: ICompanyJobService
  ) {}
  createJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id; // assuming company is authenticated and available
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "no company id" });
        return;
      }
      const skillsId = [];
      const skills = req.body.skillsRequired;
      for (const skill of skills) {
        const skillIn = await skillModal.findOne({ title: skill });
        if (!skillIn) {
          const newSkill = new skillModal({ title: skill });
          await newSkill.save();
          skillsId.push(newSkill._id);
        } else {
          skillsId.push(skillIn._id);
        }
      }
      console.log("req.boyd", req.body);
      const jobData = {
        title: req.body.title,
        location: req.body.location,
        jobType: req.body.jobType,
        employmentType: req.body.employmentType,
        description: req.body.description,
        salary: req.body.salary,
        benefits: req.body.benefits,
        experienceLevel: req.body.experienceLevel,
        applicationDeadline: req.body.applicationDeadline,
        skillsRequired: skillsId.map((id) => id.toString()),
        createdBy: companyId,
      };
      console.log("jobData", jobData);
      // in req.body skillsRequired =["",""] if any one of skills not in skill modal add to them that adn store that skills id into job collection not entire req.body in that skills are in string user entered
      const validatedData = createJobSchema.parse(jobData);
      console.log("isValidateData", validatedData);

      const job = await this.jobService.createJob(validatedData, companyId);
      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ message: "Job created successfully", job });
    } catch (err) {
      if (err instanceof ZodError) {
        const errObj: Record<string, string> = {};
        err.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: (err as Error).message });
      }
    }
  };

  updateJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "No company id provided" });
        return;
      }

      const jobId = req.params.jobId;

      const skillsId: string[] = [];
      const skills = req.body.skillsRequired;
      for (const skill of skills) {
        const skillIn = await skillModal.findOne({ title: skill });
        if (!skillIn) {
          const newSkill = new skillModal({ title: skill });
          await newSkill.save();
          skillsId.push(newSkill._id.toString());
        } else {
          skillsId.push(skillIn._id.toString());
        }
      }

      const jobData = {
        ...req.body,
        skillsRequired: skillsId,
      };

      const validatedData = updateJobSchema.parse(jobData);
      const updatedJob = await this.jobService.updateJob(
        jobId,
        companyId,
        validatedData
      );

      if (!updatedJob) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: "Job not found or unauthorized" });
        return;
      }

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Job updated successfully", updatedJob });
    } catch (err) {
      if (err instanceof ZodError) {
        const errObj: Record<string, string> = {};
        err.errors.forEach((err) => {
          errObj[err.path.join(".")] = err.message;
        });
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, errors: errObj });
      } else {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, error: (err as Error).message });
      }
    }
  };

  deleteJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "no company id" });
        return;
      }
      const jobId = req.params.jobId;
      const deleted = await this.jobService.deleteJob(jobId, companyId);
      if (!deleted) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: "Job not found or unauthorized" });
        return;
      }
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Job deleted successfully" });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (err as Error).message });
    }
  };
  getJobs: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Company ID required" });
        return;
      }

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

      const { jobs, total } = await this.jobService.getJobs(
        companyId,
        page,
        limit
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (err as Error).message });
    }
  };

  getJobApplications: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as Userr)?.id;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Company ID required" });
        return;
      }

      const jobId = req.params.jobId;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

      const result = await this.jobService.getJobApplications(
        jobId,
        companyId,
        page,
        limit
      );
      if (!result) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: "Job not found" });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result.applications,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (err as Error).message });
    }
  };
  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      console.log("jobId", jobId);
      if (!jobId) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: "Job not found" });
        return;
      }
      const result = await this.jobService.getJob(jobId);
      if (!result) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: "job not found detailed" });
        return;
      }
      console.log("result", result);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, job: result });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (err as Error).message });
    }
  };
  // updated
  async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { jobId } = req.params;
      // Extract filters from query params
      const filters: Record<string, any> = {
        ...req.query,
      };

      // Remove pagination params from filters
      delete filters.page;
      delete filters.limit;

      const applicationsData = await this.jobService.getApplications(
        page,
        limit,
        filters,
        jobId
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Applications fetched successfully",
        data: applicationsData,
      });
    } catch (error) {
      console.error(error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }
  // updated
  async shortlistApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;

      if (!applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Application ID required",
        });
        return;
      }

      const success = await this.jobService.shortlistApplication(applicationId);

      if (!success) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Application not found",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Application shortlisted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async rejectApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { rejectionReason } = req.body;

      if (!applicationId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Application ID required",
        });
        return;
      }

      const success = await this.jobService.rejectApplication(
        applicationId,
        rejectionReason
      );

      if (!success) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Application not found",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Application rejected successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}

import { Request, Response, RequestHandler } from "express";
import { TYPES } from "../../di/types";
import { inject } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { ICompanyJobService } from "../../interfaces/services/ICompanyJobService";
import { ICompanyJobController } from "../../interfaces/controllers/ICompanyJobController";
import { ISkillService } from "../../interfaces/services/ISkillService";
import { handleControllerError } from "../../utils/errorHandler";
import {
  createJobSchema,
  updateJobSchema,
} from "../../core/validations/company/company.job.validation";
import {
  CreateJobInput,
  UpdateJobInput,
} from "../../core/dtos/company/job.dto";
import { paginationSchema } from "../../core/validations/admin/admin.company.validation";
import { z } from "zod";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";
export const getApplicationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  companyId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

const rejectApplicationBodySchema = z.object({
  rejectionReason: z.string().optional(),
});

export class CompanyJobController implements ICompanyJobController {
  constructor(
    @inject(TYPES.CompanyJobService) private _jobService: ICompanyJobService,
    @inject(TYPES.SkillService) private _skillService: ISkillService
  ) {}
  createJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      if (!companyId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const skillDtos = await Promise.all(
        req.body.skillsRequired.map((skill: string) =>
          this._skillService.findOrCreateSkillByTitle(
            skill,
            companyId,
            "company"
          )
        )
      );

      const input: CreateJobInput = createJobSchema.parse({
        ...req.body,
        skillsRequired: skillDtos.map((s) => s.id),
      });

      const job = await this._jobService.createJob(input, companyId);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (err) {
      handleControllerError(err, res, "CompanyJobController:createJob");
    }
  };

  updateJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      const jobId = req.params.jobId;

      if (!companyId || !jobId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Invalid company or job ID",
        });
        return;
      }

      // 🔐 Resolve skills and validate each one
      const rawSkills = await Promise.all(
        req.body.skillsRequired.map((skill: string) =>
          this._skillService.findOrCreateSkillByTitle(
            skill,
            companyId,
            "company"
          )
        )
      );

      const invalidSkill = rawSkills.find((skill) => !skill?.id);

      if (invalidSkill) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to resolve one or more skills",
        });
        return;
      }

      const input: UpdateJobInput = updateJobSchema.parse({
        ...req.body,
        skillsRequired: rawSkills.map((s) => s.id.toString()),
      });

      const updated = await this._jobService.updateJob(jobId, companyId, input);

      if (!updated) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Job not found or unauthorized",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Job updated successfully",
        data: updated,
      });
    } catch (err) {
      handleControllerError(err, res, "CompanyJobController:updateJob");
    }
  };

  deleteJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      const jobId = req.params.jobId;

      if (!companyId || !jobId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Invalid company or job ID",
        });
        return;
      }

      const deleted = await this._jobService.deleteJob(jobId, companyId);

      if (!deleted) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Job not found or unauthorized",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (err) {
      handleControllerError(err, res, "CompanyJobController:deleteJob");
    }
  };
  getJobs = async (req: Request, res: Response) => {
    try {
      const companyId = (req.user as AuthenticatedUser)?.id;
      if (!companyId) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Company ID is required",
        });
        return;
      }

      const { page, limit } = paginationSchema.parse(req.query);

      const { jobs, total } = await this._jobService.getJobs(
        companyId,
        page,
        limit
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Jobs fetched successfully",
        data: {
          jobs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (err) {
      handleControllerError(err, res, "JobController:getJobs");
    }
  };

  getJob: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      const result = await this._jobService.getJob(jobId);

      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: result });
    } catch (err) {
      handleControllerError(err, res, "JobController:getJob");
    }
  };

  async shortlistApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const result = await this._jobService.shortlistApplication(applicationId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Application shortlisted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "shortlistApplication");
    }
  }

  async rejectApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const { rejectionReason } = rejectApplicationBodySchema.parse(req.body);

      const result = await this._jobService.rejectApplication(
        applicationId,
        rejectionReason
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Application rejected successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "rejectApplication");
    }
  }
  async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const parsedQuery = getApplicationsQuerySchema.parse(req.query);
      const page = parseInt(parsedQuery.page || "1", 10);
      const limit = parseInt(parsedQuery.limit || "10", 10);

      const filters = { ...parsedQuery };
      delete filters.page;
      delete filters.limit;

      const result = await this._jobService.getApplications(
        page,
        limit,
        filters,
        jobId
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Applications fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "getApplications");
    }
  }
  async getApplicantDetails(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const result = await this._jobService.getApplicantDetails(applicationId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Applicant details fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "getApplicantDetails");
    }
  }
}

import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";
import { IAdminCompanyManagementService } from "../../interfaces/services/IAdminCompanyManagementService ";
import { sendVerificationCompanyEmail } from "../../shared/util/email.verification.company";
import { IAdminCompanyManagementController } from "../../interfaces/controllers/IAdminCompanyManagementController";
import {
  companyIdSchema,
  companyVerificationSchema,
  paginationSchema,
} from "../../core/validations/admin/admin.company.validation";
import { handleControllerError } from "../../utils/errorHandler";

@injectable()
export class AdminCompanyManagementController
  implements IAdminCompanyManagementController
{
  constructor(
    @inject(TYPES.AdminCompanyManagementService)
    private adminCompanyManagementService: IAdminCompanyManagementService
  ) {}
  getCompanyById: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);

      const company = await this.adminCompanyManagementService.getCompanyById(
        companyId
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: company,
      });
    } catch (error) {
      handleControllerError(error, res, "getCompanyById");
    }
  };
  verifyCompany: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const { status, rejectionReason } = companyVerificationSchema.parse(
        req.body
      );

      const result = await this.adminCompanyManagementService.verifyCompany(
        companyId,
        status,
        rejectionReason
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: `Company ${status} successfully`,
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "verifyCompany");
    }
  };

  getUnverifiedCompaniesHandler: RequestHandler = async (req, res) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);

      const result =
        await this.adminCompanyManagementService.getUnverifiedCompanies(
          page,
          limit
        );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Unverified companies fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "getUnverifiedCompaniesHandler");
    }
  };

  blockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const company = await this.adminCompanyManagementService.blockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Company blocked successfully",
        data: company,
      });
    } catch (error) {
      handleControllerError(error, res, "blockcompany");
    }
  };

  unblockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const company = await this.adminCompanyManagementService.unblockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Company unblocked successfully",
        data: company,
      });
    } catch (error) {
      handleControllerError(error, res, "unblockcomapny");
    }
  };

  getCompanies: RequestHandler = async (req, res) => {
    try {
      const { page, limit, search } = paginationSchema.parse(req.query);
      const companies = await this.adminCompanyManagementService.getCompanies(
        page,
        limit,
        search
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Companies fetched successfully",
        data: companies,
      });
    } catch (error) {
      handleControllerError(error, res, "getCompanies");
    }
  };
}

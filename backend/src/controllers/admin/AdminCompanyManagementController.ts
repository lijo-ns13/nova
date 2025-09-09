import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { RequestHandler } from "express";
import { IAdminCompanyManagementService } from "../../interfaces/services/IAdminCompanyManagementService ";

import { IAdminCompanyManagementController } from "../../interfaces/controllers/IAdminCompanyManagementController";
import {
  companyIdSchema,
  companyVerificationSchema,
  paginationSchema,
} from "../../core/validations/admin/admin.company.validation";
import { handleControllerError } from "../../utils/errorHandler";
import {
  ADMIN_CONTROLLER_ERROR,
  ADMIN_MESSAGES,
} from "../../constants/message.constants";

@injectable()
export class AdminCompanyManagementController
  implements IAdminCompanyManagementController
{
  constructor(
    @inject(TYPES.AdminCompanyManagementService)
    private _adminCompanyService: IAdminCompanyManagementService
  ) {}
  getCompanyById: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);

      const company = await this._adminCompanyService.getCompanyById(
        companyId
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.COMPANY_FETCHED,
        data: company,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.GET_COMPANY_ERROR
      );
    }
  };
  verifyCompany: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const { status, rejectionReason } = companyVerificationSchema.parse(
        req.body
      );

      const result = await this._adminCompanyService.verifyCompany(
        companyId,
        status,
        rejectionReason
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.VERIFIED_SUCCESSFULLY(status),
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.VERIFY_COMPANY_ERROR
      );
    }
  };

  getUnverifiedCompaniesHandler: RequestHandler = async (req, res) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);

      const result =
        await this._adminCompanyService.getUnverifiedCompanies(
          page,
          limit
        );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.UNVERIFED_COMPANIES_FETCHED,
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.GET_UNVERIFIED_COMPANIES_ERROR
      );
    }
  };

  blockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const company = await this._adminCompanyService.blockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.BLOCK_COMPANY,
        data: company,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.BLOCK_COMPANY_ERROR
      );
    }
  };

  unblockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = companyIdSchema.parse(req.params);
      const company = await this._adminCompanyService.unblockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.UNBLOCK_COMPANY,
        data: company,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.UNBLOCK_COMPANY_ERROR
      );
    }
  };

  getCompanies: RequestHandler = async (req, res) => {
    try {
      const { page, limit, search } = paginationSchema.parse(req.query);
      const companies = await this._adminCompanyService.getCompanies(
        page,
        limit,
        search
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.COMPANY.FETCH_COMPANIES,
        data: companies,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.GET_COMPANIES_ERROR
      );
    }
  };
}

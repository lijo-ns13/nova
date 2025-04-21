import { TYPES } from "../../../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";
import { IAdminCompanyManagementService } from "../../../../core/interfaces/services/IAdminCompanyManagementService ";
import { sendVerificationCompanyEmail } from "../../../../shared/util/email.verification.company";
import { IAdminCompanyManagementController } from "../../../../core/interfaces/controllers/IAdminCompanyManagementController";

@injectable()
export class AdminCompanyManagementController
  implements IAdminCompanyManagementController
{
  constructor(
    @inject(TYPES.AdminCompanyManagementService)
    private adminCompanyManagementService: IAdminCompanyManagementService
  ) {}
  getCompanyById: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { companyId } = req.params;

      const company = await this.adminCompanyManagementService.getCompanyById(
        companyId
      );

      if (!company) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Company not found" });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        company,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  verifyCompany: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { companyId } = req.params;
      const { status, rejectionReason } = req.body; // 'accepted' | 'rejected'

      if (!["accepted", "rejected"].includes(status)) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Invalid status" });
        return;
      }

      // First, fetch the company to get email + name
      const company = await this.adminCompanyManagementService.findCompanyById(
        companyId
      );
      if (!company) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "Company not found" });
        return;
      }

      const { email, companyName } = company;

      // Prepare email content
      let subject = "";
      let text = "";
      let html = "";

      if (status === "accepted") {
        subject = "🎉 Your Company Has Been Verified!";
        text = `Dear ${companyName},\n\nCongratulations! Your company has been verified on Brix. You can now enjoy full access to post jobs and manage candidates.\n\nWelcome aboard!\n\nBrix Team`;
        html = `
          <h2>Dear ${companyName},</h2>
          <p>🎉 Congratulations! Your company has been <strong>verified</strong> on Brix.</p>
          <p>You now have full access to post jobs and manage candidates.</p>
          <br/>
          <p>Welcome aboard!</p>
          <p>Regards,<br/>Brix Team</p>
        `;

        // ✅ Update the verification status in the database
        await this.adminCompanyManagementService.verifyCompany(
          companyId,
          status
        );
      } else if (status === "rejected") {
        subject = "❌ Company Verification Rejected";
        text = `Dear ${companyName},\n\nWe regret to inform you that your company verification request has been rejected after review.\n\nIf you have any questions, contact support.\n\nRegards,\nBrix Team`;
        html = `
          <h2>Dear ${companyName},</h2>
          <p>❌ We regret to inform you that your company verification has been <strong>rejected</strong>.</p>
          <p><strong>Reason:</strong> ${rejectionReason}</p>
          <p>You can do the same process again with proper documents and data.</p>
          <br/>
          <p>Regards,<br/>Brix Team</p>
        `;

        // ❗ Delete the company from the database
        await this.adminCompanyManagementService.deleteCompany(companyId);
      }

      // ✅ Send email notification
      await sendVerificationCompanyEmail(email, subject, text, html);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: `Company ${status} successfully`,
      });
    } catch (error: any) {
      console.error("Error verifying company:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: error.message });
    }
  };

  getUnverifiedCompaniesHandler: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result =
        await this.adminCompanyManagementService.getUnverifiedCompanies(
          page,
          limit
        );
      console.log("unverified companies", result.companies);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Unverified companies fetched successfully",
        data: result.companies,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  blockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = req.params;
      const company = await this.adminCompanyManagementService.blockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Company blocked successfully",
        company,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  unblockCompany: RequestHandler = async (req, res) => {
    try {
      const { companyId } = req.params;
      const company = await this.adminCompanyManagementService.unblockCompany(
        companyId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Company unblocked successfully",
        company,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };

  getCompanies: RequestHandler = async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const data = await this.adminCompanyManagementService.getCompanies(
        page,
        limit
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Companies fetched successfully",
        data,
      });
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  };
}

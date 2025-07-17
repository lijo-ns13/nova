import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

import { IAdminCompanyManagementController } from "../../interfaces/controllers/IAdminCompanyManagementController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const AdminCompanyManagerController =
  container.get<IAdminCompanyManagementController>(
    TYPES.AdminCompanyManagementController
  );

const router = Router();
// router.get("/companies", (req, res) =>
//   AdminCompanyManagerController.getCompanies
// );
router.get("/companies", AdminCompanyManagerController.getCompanies);
router.get(
  "/companies/unverified",
  AdminCompanyManagerController.getUnverifiedCompaniesHandler
);
router.use(authMiddleware.authenticate("admin"));

router.get(
  "/companies/:companyId",
  AdminCompanyManagerController.getCompanyById
);
router.patch(
  "/companies/block/:companyId",
  AdminCompanyManagerController.blockCompany
);
router.patch(
  "/companies/unblock/:companyId",
  AdminCompanyManagerController.unblockCompany
);
router.patch(
  "/companies/verify/:companyId",
  AdminCompanyManagerController.verifyCompany
);

export default router;

import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IAdminCompanyManagementController } from "../../interfaces/controllers/IAdminCompanyManagementController";
import { ADMIN_COMPANY_ROUTES } from "../../constants/routes/adminRoutes";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const AdminCompanyManagerController =
  container.get<IAdminCompanyManagementController>(
    TYPES.AdminCompanyManagementController
  );

const router = Router();

router.get(
  ADMIN_COMPANY_ROUTES.ROOT,
  AdminCompanyManagerController.getCompanies
);
router.get(
  ADMIN_COMPANY_ROUTES.UNVERIFIED,
  AdminCompanyManagerController.getUnverifiedCompaniesHandler
);
router.use(authMiddleware.authenticate("admin"));

router.get(
  ADMIN_COMPANY_ROUTES.BY_ID,
  AdminCompanyManagerController.getCompanyById
);
router.patch(
  ADMIN_COMPANY_ROUTES.BLOCK,
  AdminCompanyManagerController.blockCompany
);
router.patch(
  ADMIN_COMPANY_ROUTES.UNBLOCK,
  AdminCompanyManagerController.unblockCompany
);
router.patch(
  ADMIN_COMPANY_ROUTES.VERIFY,
  AdminCompanyManagerController.verifyCompany
);

export default router;

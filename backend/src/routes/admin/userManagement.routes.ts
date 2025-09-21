import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

import { IAdminUserManagementController } from "../../interfaces/controllers/IAdminUserManagementController ";
import { ADMIN_USER_ROUTES } from "../../constants/routes/adminRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const AdminUserManagerController =
  container.get<IAdminUserManagementController>(
    TYPES.AdminUserManagementController
  );

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.ADMIN));

// ==== User Management Routes ====
router.patch(ADMIN_USER_ROUTES.BLOCK, AdminUserManagerController.blockUser);
router.patch(ADMIN_USER_ROUTES.UNBLOCK, AdminUserManagerController.unblockUser);
router.get(ADMIN_USER_ROUTES.ROOT, (req, res, next) =>
  AdminUserManagerController.getUsers(req, res, next)
);

export default router;

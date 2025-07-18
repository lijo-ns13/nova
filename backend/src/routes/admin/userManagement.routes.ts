import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

import { IAdminUserManagementController } from "../../interfaces/controllers/IAdminUserManagementController ";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const AdminUserManagerController =
  container.get<IAdminUserManagementController>(
    TYPES.AdminUserManagementController
  );

const router = Router();
router.use(authMiddleware.authenticate("admin"));

// ==== User Management Routes ====
router.patch("/users/block/:userId", AdminUserManagerController.blockUser);
router.patch("/users/unblock/:userId", AdminUserManagerController.unblockUser);
router.get("/users", (req, res, next) =>
  AdminUserManagerController.getUsers(req, res, next)
);

export default router;

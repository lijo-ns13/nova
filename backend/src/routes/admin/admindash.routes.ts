import express from "express";

import container from "../../di/container";
import { IAdminDashboardController } from "../../interfaces/controllers/IAdminDashboardController";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ADMIN_DASHBOARD_ROUTES } from "../../constants/routes/adminRoutes";
const AdminDashController = container.get<IAdminDashboardController>(
  TYPES.AdminDashboardController
);
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const router = express.Router();
router.use(authMiddleware.authenticate("admin"));
router.get(ADMIN_DASHBOARD_ROUTES.REVENUE_STATS, (req, res) =>
  AdminDashController.getRevenueStats(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.TOP_PLANS, (req, res) =>
  AdminDashController.getTopPlans(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.USER_GROWTH, (req, res) =>
  AdminDashController.getUserGrowth(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.USER_STATS, (req, res) =>
  AdminDashController.getUserStats(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.DOWNLOAD_REPORT, (req, res) =>
  AdminDashController.downloadTransactionReport(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.FULL_REPORT, (req, res) =>
  AdminDashController.getFullReport(req, res)
);
router.get(ADMIN_DASHBOARD_ROUTES.TRANSACTIONS, (req, res) =>
  AdminDashController.getTransactions(req, res)
);
export default router;

import express from "express";

import container from "../di/container";
import { IAdminDashboardController } from "../interfaces/controllers/IAdminDashboardController";
import { TYPES } from "../di/types";
const AdminDashController = container.get<IAdminDashboardController>(
  TYPES.AdminDashboardController
);

const router = express.Router();

router.get("/revenue-stats", (req, res) =>
  AdminDashController.getRevenueStats(req, res)
);
router.get("/top-plans", (req, res) =>
  AdminDashController.getTopPlans(req, res)
);
router.get("/user-growth", (req, res) =>
  AdminDashController.getUserGrowth(req, res)
);
router.get("/user-stats", (req, res) =>
  AdminDashController.getUserStats(req, res)
);
router.get("/download-report", (req, res) =>
  AdminDashController.downloadTransactionReport(req, res)
);
router.get("/full-report", (req, res) =>
  AdminDashController.getFullReport(req, res)
);
router.get("/transactions", (req, res) =>
  AdminDashController.getTransactions(req, res)
);
export default router;

// import {
//   getRevenueStats,
//   getTopPlans,
//   downloadTransactionReport,
//   getUserGrowth,
//   getUserStats,
//   getFullReport,
//   getTransactions,
// } from "../controllers/admin/dash/AdminAnalysticsController";

// Revenue and plan analytics
// router.get("/revenue-stats", getRevenueStats);
// router.get("/top-plans", getTopPlans);
// router.get("/user-growth", getUserGrowth);
// router.get("/user-stats", getUserStats);
// router.get("/download-report", downloadTransactionReport);
// router.get("/full-report", getFullReport);
// router.get("/transactions", getTransactions)

// src/routes/adminAnalyticsRoutes.ts
import express from "express";
import {
  getRevenueStats,
  getTopPlans,
  downloadTransactionReport,
  getUserGrowth,
  getUserStats,
  getFullReport,
  getTransactions,
} from "../controllers/admin/dash/AdminAnalysticsController";

const router = express.Router();

// Revenue and plan analytics
router.get("/revenue-stats", getRevenueStats);
router.get("/top-plans", getTopPlans);

// User analytics
router.get("/user-growth", getUserGrowth);
router.get("/user-stats", getUserStats);

// Report generation
router.get("/download-report", downloadTransactionReport);

router.get("/full-report", getFullReport);
// Add to your routes
router.get("/transactions", getTransactions);
export default router;

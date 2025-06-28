// src/modules/dashboard/routes/companyDashboardRoutes.ts

import express from "express";
import { getCompanyDashboardStats } from "../controllers/company/CompanyDashboardController";

const router = express.Router();

router.get("/stats", (req, res) => {
  getCompanyDashboardStats(req, res).catch((err) => {
    console.error("Route handler error:", err);
    res.status(500).json({ message: "Internal server error" });
  });
});
export default router;

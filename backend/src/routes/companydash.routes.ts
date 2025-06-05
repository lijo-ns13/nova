// src/modules/dashboard/routes/companyDashboardRoutes.ts

import express from "express";
import { getCompanyDashboardStats } from "../controllers/company/CompanyDashboardController";

const router = express.Router();

router.get("/stats", getCompanyDashboardStats);

export default router;

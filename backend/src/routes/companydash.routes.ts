// import express from "express";
// import { getCompanyDashboardStats } from "../controllers/company/CompanyDashboardController";

// const router = express.Router();

// router.get("/stats", (req, res) => {
//   getCompanyDashboardStats(req, res).catch((err) => {
//     console.error("Route handler error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   });
// });
// export default router;

import express from "express";

import container from "../di/container";
import { TYPES } from "../di/types";
import { ICompanyDashboardController } from "../interfaces/controllers/ICompanyDashboardController";
const CompanyDashboardController = container.get<ICompanyDashboardController>(
  TYPES.CompanyDashboardController
);

const router = express.Router();

router.get("/stats", (req, res) =>
  CompanyDashboardController.getCompanyDashboardStats(req, res)
);

export default router;

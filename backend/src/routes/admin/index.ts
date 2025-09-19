import { Router } from "express";
import UserManagementRouter from "./userManagement.routes";
import CompanyManagementRouter from "./companyManagement.routes";
import SkillRouter from "./skill.routes";
import SubscriptionPlanRouter from "./subscriptionPlan.routes";
import FeatureRouter from "./feature.routes";
import AdminDashboardRouter from "./admindash.routes";
const router = Router();

router.use("/users", UserManagementRouter);
router.use("/companies", CompanyManagementRouter);
router.use("/skills", SkillRouter);
router.use("/subscription", SubscriptionPlanRouter);
router.use("/feature", FeatureRouter);
router.use("/api/analytics", AdminDashboardRouter);
export default router;

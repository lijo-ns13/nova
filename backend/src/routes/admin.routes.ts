import { Router } from "express";
import UserManagementRouter from "./admin/userManagement.routes";
import AdminManagementRouter from "./admin/companyManagement.routes";
import SkillRouter from "./admin/skill.routes";
import SubscriptionPlanRouter from "./admin/subscriptionPlan.routes";
import FeatureRouter from "./admin/feature.routes";
const router = Router();

// job
router.use("/", UserManagementRouter);
router.use("/", AdminManagementRouter);
router.use("/", SkillRouter);
router.use("/subscription", SubscriptionPlanRouter);
router.use("/feature", FeatureRouter);
export default router;

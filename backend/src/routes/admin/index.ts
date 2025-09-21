import { Router } from "express";
import UserManagementRouter from "./userManagement.routes";
import CompanyManagementRouter from "./companyManagement.routes";
import SkillRouter from "./skill.routes";
import SubscriptionPlanRouter from "./subscriptionPlan.routes";
import FeatureRouter from "./feature.routes";
import AdminDashboardRouter from "./admindash.routes";
import { ADMIN_ROUTES } from "../../constants/routes/adminRoutes";
const router = Router();

router.use(ADMIN_ROUTES.USERS, UserManagementRouter);
router.use(ADMIN_ROUTES.COMPANIES, CompanyManagementRouter);
router.use(ADMIN_ROUTES.SKILLS, SkillRouter);
router.use(ADMIN_ROUTES.SUBSCRIPTION, SubscriptionPlanRouter);
router.use(ADMIN_ROUTES.FEATURE, FeatureRouter);
router.use(ADMIN_ROUTES.ANALYTICS, AdminDashboardRouter);
export default router;

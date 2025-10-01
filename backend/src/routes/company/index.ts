import { Router } from "express";
import JobRouter from "./job.routes";
import profileRouter from "./company.profile.routes";
import interviewRouter from "./interview.routes";
import jobApplicantRouter from "./jobapplicant.routes";
import companyDashboardRouter from "./companydash.routes";
import { COMPANY_ROUTES } from "../../constants/routes/companyRoutes";
const router = Router();
router.use(COMPANY_ROUTES.DASHBOARD, companyDashboardRouter);
router.use(COMPANY_ROUTES.JOB, JobRouter);
router.use(COMPANY_ROUTES.PROFILE, profileRouter);
router.use(COMPANY_ROUTES.INTERVIEW, interviewRouter);
router.use(COMPANY_ROUTES.APPLICANT, jobApplicantRouter);

export default router;

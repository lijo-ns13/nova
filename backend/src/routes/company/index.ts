import { Router } from "express";
import JobRouter from "./job.routes";
import profileRouter from "./company.profile.routes";
import interviewRouter from "./interview.routes";
import jobApplicantRouter from "./jobapplicant.routes";
import companyDashboardRouter from "./companydash.routes";
const router = Router();

router.use("/job", JobRouter);
router.use("/profile", profileRouter);
router.use("/interview", interviewRouter);
router.use("/applicant", jobApplicantRouter);
router.use("/", companyDashboardRouter);
export default router;

import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyInterviewController } from "../../interfaces/controllers/ICompanyInterviewController";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";
import { COMPANY_INTERVIEW_ROUTES } from "../../constants/routes/companyRoutes";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const interviewController = container.get<ICompanyInterviewController>(
  TYPES.CompanyInterviewController
);

const router = Router();
router.use(authMiddleware.authenticate("company"));
router.use(authMiddleware.check());

router.post(COMMON_ROUTES.ROOT, (req, res, next) =>
  interviewController.createInterview(req, res).catch(next)
);

router.get(COMPANY_INTERVIEW_ROUTES.UPCOMING, (req, res, next) =>
  interviewController.getUpcomingAcceptedInterviews(req, res).catch(next)
);

router.post(
  COMPANY_INTERVIEW_ROUTES.RESCHEDULE,
  interviewController.proposeReschedule.bind(interviewController)
);
export default router;

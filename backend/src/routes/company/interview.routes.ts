import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyInterviewController } from "../../interfaces/controllers/ICompanyInterviewController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const interviewController = container.get<ICompanyInterviewController>(
  TYPES.CompanyInterviewController
);

const router = Router();
router.use(authMiddleware.authenticate("company"));
router.use(authMiddleware.check());

router.post("/interview", (req, res, next) =>
  interviewController.createInterview(req, res).catch(next)
);
router.get("/applicant/:applicationId", (req, res, next) =>
  interviewController.getApplicantDetails(req, res).catch(next)
);
export default router;

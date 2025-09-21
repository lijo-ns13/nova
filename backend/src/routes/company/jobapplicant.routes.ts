import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";

import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IJobApplicantManagementController } from "../../interfaces/controllers/IJobApplicantManagementController";
import { JOB_APPLICANT_ROUTES } from "../../constants/routes/companyRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const controller = container.get<IJobApplicantManagementController>(
  TYPES.JobApplicantManagementController
);

const router = Router();

router.use(authMiddleware.authenticate(AUTH_ROLES.COMPANY));
router.use(authMiddleware.check());

router.patch(JOB_APPLICANT_ROUTES.STATUS, (req, res, next) =>
  controller.updateApplicationStatus(req, res, next).catch(next)
);

router.get(JOB_APPLICANT_ROUTES.BY_ID, (req, res, next) =>
  controller.getApplicationById(req, res, next).catch(next)
);

// router.post("/", (req, res, next) =>
//   controller.createApplication(req, res, next).catch(next)
// );

// router.get("/job/:jobId", (req, res, next) =>
//   controller.getApplicationsByJob(req, res, next).catch(next)
// );

// router.get("/user/:userId", (req, res, next) =>
//   controller.getApplicationsByUser(req, res, next).catch(next)
// );

export default router;

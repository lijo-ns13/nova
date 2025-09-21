import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyJobController } from "../../interfaces/controllers/ICompanyJobController";
import { COMPANY_JOB_ROUTES } from "../../constants/routes/companyRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const jobController = container.get<ICompanyJobController>(
  TYPES.CompanyJobController
);

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.COMPANY));
router.use(authMiddleware.check());
router.get(COMPANY_JOB_ROUTES.APPLICATION_DETAILS, (req, res, next) =>
  jobController.getApplicantDetails(req, res).catch(next)
);
router.get(COMPANY_JOB_ROUTES.APPLICANTS, (req, res, next) =>
  jobController.getApplications(req, res).catch(next)
);
router.patch(COMPANY_JOB_ROUTES.SHORTLIST, (req, res, next) =>
  jobController.shortlistApplication(req, res).catch(next)
);
router.patch(COMPANY_JOB_ROUTES.REJECT, (req, res, next) =>
  jobController.rejectApplication(req, res).catch(next)
);
router.post(COMPANY_JOB_ROUTES.ROOT, jobController.createJob);
router.get(COMPANY_JOB_ROUTES.ROOT, jobController.getJobs);

router.get(COMPANY_JOB_ROUTES.BY_ID, jobController.getJob);
router.put(COMPANY_JOB_ROUTES.BY_ID, jobController.updateJob);
router.delete(COMPANY_JOB_ROUTES.BY_ID, jobController.deleteJob);

export default router;

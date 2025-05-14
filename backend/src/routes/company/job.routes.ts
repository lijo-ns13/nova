import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyJobController } from "../../interfaces/controllers/ICompanyJobController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const jobController = container.get<ICompanyJobController>(
  TYPES.CompanyJobController
);

const router = Router();
router.use(authMiddleware.authenticate("company"));
router.use(authMiddleware.check());
router.get("/job/:applicationId/details", (req, res, next) =>
  jobController.getApplicantDetails(req, res).catch(next)
);
router.get("/job/:jobId/applicants", (req, res, next) =>
  jobController.getApplications(req, res).catch(next)
);
router.patch("/job/shortlist/:applicationId", (req, res, next) =>
  jobController.shortlistApplication(req, res).catch(next)
);
router.patch("/job/reject/:applicationId", (req, res, next) =>
  jobController.rejectApplication(req, res).catch(next)
);
router.post("/job", jobController.createJob);
router.put("/job/:jobId", jobController.updateJob);
router.delete("/job/:jobId", jobController.deleteJob);
router.get("/job", jobController.getJobs);
// router.get("/job/:jobId/applications", jobController.getJobApplications);
router.get("/job/:jobId", jobController.getJob);
export default router;

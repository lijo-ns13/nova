import { Router } from "express";
import container from "../../../../di/container";
import { TYPES } from "../../../../di/types";
import { IAuthMiddleware } from "../../../../core/interfaces/middlewares/IAuthMiddleware";
import { ICompanyJobController } from "../../../../core/interfaces/controllers/ICompanyJobController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const jobController = container.get<ICompanyJobController>(
  TYPES.CompanyJobController
);

const router = Router();
router.use(authMiddleware.authenticate("company"));

router.post("/job", jobController.createJob);
router.put("/job/:jobId", jobController.updateJob);
router.delete("/job/:jobId", jobController.deleteJob);
router.get("/job", jobController.getJobs);
router.get("/job/:jobId/applications", jobController.getJobApplications);
router.get("/job/:jobId", jobController.getJob);
export default router;

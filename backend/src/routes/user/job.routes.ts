import { IUserJobController } from "../../interfaces/controllers/IUserJobController";

import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
import multer from "multer";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.single("resume"); // 'media' should match your form field name

const jobController = container.get<IUserJobController>(
  TYPES.UserJobController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());
// Get all jobs
router.get("/jobs", jobController.getAllJobs);
// Get all jobs the user has applied to
router.get("/jobs/applied-jobs", jobController.getAppliedJobs);

// Get a specific job by ID
router.get("/jobs/:jobId", jobController.getJob);
router.get(
  "/jobs/:jobId/check-application",
  jobController.checkApplicationStatus
);
// Apply to a job
router.post("/jobs/:jobId/apply", uploadMedia, jobController.applyToJob);

export default router;

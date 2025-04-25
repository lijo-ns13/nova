import { IUserJobController } from "../../../../core/interfaces/controllers/IUserJobController";

import { Router } from "express";
import container from "../../../../di/container";
import { TYPES } from "../../../../di/types";
import { IAuthMiddleware } from "../../../../core/interfaces/middlewares/IAuthMiddleware";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const jobController = container.get<IUserJobController>(
  TYPES.UserJobController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));

// Get all jobs
router.get("/jobs", jobController.getAllJobs);
// Get all jobs the user has applied to
router.get("/jobs/applied-jobs", jobController.getAppliedJobs);
// Get all jobs saved by the user
router.get("/jobs/saved-jobs", jobController.getSavedJobs);
// Get a specific job by ID
router.get("/jobs/:jobId", jobController.getJob);

// Apply to a job
router.post("/jobs/:jobId/apply", jobController.applyToJob);

// Save a job
router.post("/jobs/:jobId/save", jobController.saveJob);

// Unsave a job
router.delete("/jobs/:jobId/unsave", jobController.unsaveJob);

export default router;

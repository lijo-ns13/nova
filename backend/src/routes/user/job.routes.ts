import { IUserJobController } from "../../interfaces/controllers/IUserJobController";

import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
import multer from "multer";
import { USER_JOB_ROUTES } from "../../constants/routes/userRoutes";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMedia = upload.single("resume");

const jobController = container.get<IUserJobController>(
  TYPES.UserJobController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

router.get(USER_JOB_ROUTES.ROOT, jobController.getAllJobs);
router.get(USER_JOB_ROUTES.APPLIED_JOBS, jobController.getAppliedJobs);
router.get(USER_JOB_ROUTES.JOB_DETAIL, jobController.getJob);
router.get(
  USER_JOB_ROUTES.CHECK_APPLICATION,
  jobController.checkApplicationStatus
);
router.post(USER_JOB_ROUTES.APPLY, uploadMedia, jobController.applyToJob);

export default router;

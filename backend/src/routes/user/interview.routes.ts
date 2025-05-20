import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IUserInterviewController } from "../../interfaces/controllers/IUserInterviewController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const interviewController = container.get<IUserInterviewController>(
  TYPES.UserInterviewController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

router.patch(
  "/interview/updatestatus/:applicationId/:status",
  (req, res, next) =>
    interviewController.updateInterviewStatus(req, res).catch(next)
);

export default router;

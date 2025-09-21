import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IUserInterviewController } from "../../interfaces/controllers/IUserInterviewController";
import { USER_INTERVIEW_ROUTES } from "../../constants/routes/userRoutes";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const interviewController = container.get<IUserInterviewController>(
  TYPES.UserInterviewController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

router.patch(USER_INTERVIEW_ROUTES.UPDATE_STATUS, (req, res, next) =>
  interviewController.updateInterviewStatus(req, res).catch(next)
);
router.put(
  USER_INTERVIEW_ROUTES.RESCHEDULE_RESPONSE,
  interviewController.updateInterviewStatusRescheduled.bind(interviewController)
);
router.get(
  USER_INTERVIEW_ROUTES.RESCHEDULE_SLOTS,
  interviewController.getRescheduleSlots.bind(interviewController)
);
export default router;

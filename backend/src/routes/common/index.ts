import { Router, Request, Response } from "express";
import skillRouter from "./skill.routes";
import ProfileViewRouter from "./profile-view.routes";
import messageRoutes from "./messages.routes";

import notificationRouter from "./notification.routes";
import { COMMON_MAIN_ROUTES } from "../../constants/routes/commonRoutes";

const router = Router();

router.use(COMMON_MAIN_ROUTES.SKILL, skillRouter);
router.use(COMMON_MAIN_ROUTES.PROFILE, ProfileViewRouter);
router.use(COMMON_MAIN_ROUTES.MESSAGES, messageRoutes);
router.use(COMMON_MAIN_ROUTES.NOTIFICATION, notificationRouter);

export default router;

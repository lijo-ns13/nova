import { Router } from "express";
import skillRouter from "./common/skill.routes";
import ProfileViewRouter from "./common/profile-view.routes";

import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
export default router;

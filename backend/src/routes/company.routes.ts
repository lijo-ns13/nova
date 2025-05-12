import { Router } from "express";
import JobRouter from "./company/job.routes";
import profileRouter from "./company/company.profile.routes";
import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

// router.use(authMiddleware.check());
// job
router.use("/", JobRouter);
router.use("/profile", profileRouter);
export default router;

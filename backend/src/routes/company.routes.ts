import { Router } from "express";
import JobRouter from "./company/job.routes";
import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

// job
router.use("/", authMiddleware.check(), JobRouter);
export default router;

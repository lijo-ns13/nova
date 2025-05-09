import { Router } from "express";
import JobRouter from "./user/job.routes";
import profileRouter from "./user/profile.routes";
import postRouter from "./user/post.routes";
import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
router.use(authMiddleware.check());
// job
router.use("/", JobRouter);
router.use("/user-profile", profileRouter);
router.use("/", postRouter);
export default router;

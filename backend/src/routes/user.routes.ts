import { Router } from "express";
import JobRouter from "./user/job.routes";
import profileRouter from "./user/profile.routes";
import postRouter from "./user/post.routes";
import interviewRouter from "./user/interview.routes";
import container from "../di/container";
import userSkillRouter from "./user/skill.routes";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";

const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
// router.use(authMiddleware.check());

router.use("/", JobRouter);
router.use("/user-profile", profileRouter);
router.use("/", postRouter);
router.use("/", interviewRouter);
router.use("/userskills", userSkillRouter);
export default router;

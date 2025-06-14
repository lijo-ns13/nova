import { Router } from "express";
// routes
import JobRouter from "./user/job.routes";
import profileRouter from "./user/profile.routes";
import postRouter from "./user/post.routes";
import interviewRouter from "./user/interview.routes";
import followRouter from "./user/follow.routes";
import container from "../di/container";
import userSkillRouter from "./user/skill.routes";
import subWithFeatRouter from "./user/subWithFeat.routes";

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
router.use("/users", followRouter);
router.use("/subfeat", subWithFeatRouter);
export default router;

import { Router } from "express";
import JobRouter from "./job.routes";
import profileRouter from "./profile.routes";
import postRouter from "./post.routes";
import interviewRouter from "./interview.routes";
import followRouter from "./follow.routes";
import userSkillRouter from "./skill.routes";
import subWithFeatRouter from "./subWithFeat.routes";

const router = Router();

router.use("/", JobRouter);
router.use("/user-profile", profileRouter);
router.use("/post", postRouter);
router.use("/", interviewRouter);
router.use("/userskills", userSkillRouter);
router.use("/users", followRouter);
router.use("/subfeat", subWithFeatRouter);
export default router;

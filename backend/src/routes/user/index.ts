import { Router } from "express";
import JobRouter from "./job.routes";
import profileRouter from "./profile.routes";
import postRouter from "./post.routes";
import interviewRouter from "./interview.routes";
import followRouter from "./follow.routes";
import userSkillRouter from "./skill.routes";
import subWithFeatRouter from "./subWithFeat.routes";
import { USER_ROUTES } from "../../constants/routes/userRoutes";

const router = Router();

router.use(USER_ROUTES.JOB, JobRouter);
router.use(USER_ROUTES.PROFILE, profileRouter);
router.use(USER_ROUTES.POST, postRouter);
router.use(USER_ROUTES.INTERVIEW, interviewRouter);
router.use(USER_ROUTES.USER_SKILLS, userSkillRouter);
router.use(USER_ROUTES.USERS, followRouter);
router.use(USER_ROUTES.SUBSCRIPTION_FEATURE, subWithFeatRouter);
export default router;

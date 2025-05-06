import { Router } from "express";
import JobRouter from "./user/job.routes";
import profileRouter from "./user/profile.routes";
import postRouter from "./user/post.routes";
const router = Router();

// job
router.use("/", JobRouter);
router.use("/user-profile", profileRouter);
router.use("/", postRouter);
export default router;

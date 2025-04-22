import { Router } from "express";
import JobRouter from "./user/job.routes";
import profileRouter from "./user/profile.routes";
const router = Router();

// job
router.use("/", JobRouter);
router.use("/user-profile", profileRouter);
export default router;

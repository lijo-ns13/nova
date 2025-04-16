import { Router } from "express";
import JobRouter from "./user/job.routes";
const router = Router();

// job
router.use("/", JobRouter);
export default router;

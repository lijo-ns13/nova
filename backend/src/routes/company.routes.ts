import { Router } from "express";
import JobRouter from "./company/job.routes";
const router = Router();

// job
router.use("/", JobRouter);
export default router;

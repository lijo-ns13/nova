import { Router } from "express";
import UserManagementRouter from "./admin/userManagement.routes";
const router = Router();

// job
router.use("/", UserManagementRouter);
export default router;

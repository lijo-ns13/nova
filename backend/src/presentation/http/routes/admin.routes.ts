import { Router } from "express";
import UserManagementRouter from "./admin/userManagement.routes";
import AdminManagementRouter from "./admin/companyManagement.routes";
const router = Router();

// job
router.use("/", UserManagementRouter);
router.use("/", AdminManagementRouter);
export default router;

import { Router } from "express";
import userAuthRoutes from "./userAuth.routes";
import companyAuthRoutes from "./companyAuth.routes";
import adminAuthRoutes from "./adminAuth.routes";

const router = Router();

router.use("/admin", adminAuthRoutes);
router.use("/company", companyAuthRoutes);
router.use("/", userAuthRoutes);
export default router;

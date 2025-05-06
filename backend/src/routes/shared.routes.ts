import { Router } from "express";
import skillRouter from "./common/skill.routes";
import ProfileViewRouter from "./common/profile-view.routes";

const router = Router();

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
export default router;

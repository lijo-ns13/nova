import { Router } from "express";
import skillRouter from "./common/skill.routes";
const router = Router();

router.use("/skill", skillRouter);
export default router;

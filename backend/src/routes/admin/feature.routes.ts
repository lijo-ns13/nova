import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IFeatureController } from "../../interfaces/controllers/IFeatureController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const featureController = container.get<IFeatureController>(
  TYPES.FeatureController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));

router.post("/", (req, res) => featureController.createFeature(req, res));
router.get("/", (req, res) => featureController.getAllFeature(req, res));
router.get("/:id", (req, res) => featureController.getByIdFeature(req, res));
router.put("/:id", (req, res) => featureController.updateFeature(req, res));
router.delete("/:id", (req, res) => featureController.deleteFeature(req, res));

export default router;

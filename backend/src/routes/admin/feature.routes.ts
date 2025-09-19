import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IFeatureController } from "../../interfaces/controllers/IFeatureController";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const featureController = container.get<IFeatureController>(
  TYPES.FeatureController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));

router.post(COMMON_ROUTES.ROOT, (req, res) =>
  featureController.createFeature(req, res)
);
router.get(COMMON_ROUTES.ROOT, (req, res) =>
  featureController.getAllFeature(req, res)
);
router.get(COMMON_ROUTES.BY_ID, (req, res) =>
  featureController.getByIdFeature(req, res)
);
router.put(COMMON_ROUTES.BY_ID, (req, res) =>
  featureController.updateFeature(req, res)
);
router.delete(COMMON_ROUTES.BY_ID, (req, res) =>
  featureController.deleteFeature(req, res)
);

export default router;

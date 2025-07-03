// routes/cloudinaryRoutes.ts
import { Router } from "express";
import { ICloudinaryController } from "../../controllers/CloudinaryController";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { memoryUpload } from "../../middlewares/upload.middleware";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IMediaController } from "../../interfaces/controllers/IMediaController";

const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const mediaController = container.get<IMediaController>(TYPES.MediaController);

router.use(authMiddleware.authenticateMultiple(["user", "admin", "company"]));
router.get(
  "/view/:s3key(*)",
  mediaController.getMediaByS3.bind(mediaController)
);

export default router;

// // routes/cloudinaryRoutes.ts
// import { Router } from "express";
// import { ICloudinaryController } from "../../controllers/CloudinaryController";
// import container from "../../di/container";
// import { TYPES } from "../../di/types";
// import { memoryUpload } from "../../middlewares/upload.middleware";
// import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

// const router = Router();
// const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

// const controller = container.get<ICloudinaryController>(
//   TYPES.CloudinaryController
// );

// router.use(authMiddleware.authenticateMultiple(["user", "admin", "company"]));
// router.post(
//   "/upload",
//   memoryUpload.single("file"),
//   controller.uploadMedia.bind(controller)
// );
// router.get("/media/:publicId(*)", controller.generateMedia.bind(controller));

// export default router;

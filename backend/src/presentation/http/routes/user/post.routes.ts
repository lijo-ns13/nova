import { IUserJobController } from "../../../../core/interfaces/controllers/IUserJobController";

import { Router } from "express";
import container from "../../../../di/container";
import { TYPES } from "../../../../di/types";
import { IAuthMiddleware } from "../../../../core/interfaces/middlewares/IAuthMiddleware";
import { IPostController } from "../../../../core/interfaces/controllers/post/IPostController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const postController = container.get<IPostController>(TYPES.PostController);
import multer from "multer";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.array("media"); // 'media' should match your form field name

const router = Router();
router.use(authMiddleware.authenticate("user"));

router.post("/post", uploadMedia, (req, res, next) => {
  postController.create(req, res).catch(next); // This ensures the error is passed to Express's error handler
});
router.get("/post/:postId", (req, res, next) => {
  postController.getPost(req, res).catch(next); // This ensures the error is passed to Express's error handler
});
router.get("/post", (req, res, next) => {
  postController.getAllPost(req, res).catch(next); // This ensures the error is passed to Express's error handler
});
router.post("/post/like/:postId", (req, res, next) => {
  postController.likeOrUnlikePost(req, res).catch(next);
});

// Get all likes for a post
router.get("/post/like/:postId", (req, res, next) => {
  postController.getLikesForPost(req, res).catch(next);
});

// comment
router.post("/post/comment", (req, res, next) => {
  postController.createComment(req, res).catch(next);
});
router.get("/post/comment/:postId", (req, res, next) => {
  postController.getPostComments(req, res).catch(next);
});
export default router;

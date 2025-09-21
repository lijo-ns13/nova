import { IUserJobController } from "../../interfaces/controllers/IUserJobController";

import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IPostController } from "../../interfaces/controllers/post/IPostController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const postController = container.get<IPostController>(TYPES.PostController);
import multer from "multer";
import { POST_ROUTES } from "../../constants/routes/userRoutes";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMedia = upload.array("media");

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

router.post(POST_ROUTES.ROOT, uploadMedia, (req, res, next) => {
  postController.create(req, res).catch(next);
});
router.get(POST_ROUTES.USER_POSTS, (req, res, next) =>
  postController.getUsersPosts(req, res).catch(next)
);
router.get(POST_ROUTES.BY_ID, (req, res, next) => {
  postController.getPost(req, res).catch(next);
});
router.delete(POST_ROUTES.BY_ID, (req, res, next) =>
  postController.delete(req, res).catch(next)
);

router.get(POST_ROUTES.ROOT, (req, res, next) => {
  postController.getAllPost(req, res).catch(next);
});
router.post(POST_ROUTES.LIKE, (req, res, next) => {
  postController.likeOrUnlikePost(req, res).catch(next);
});

// Get all likes for a post
router.get(POST_ROUTES.LIKE, (req, res, next) => {
  postController.getLikesForPost(req, res).catch(next);
});

// comment
router.post(POST_ROUTES.COMMENT_ROOT, (req, res, next) => {
  postController.createComment(req, res).catch(next);
});
router.get(POST_ROUTES.COMMENT_BY_POST, (req, res, next) => {
  postController.getPostComments(req, res).catch(next);
});
// Update a comment
router.put(POST_ROUTES.COMMENT_BY_ID, (req, res) =>
  postController.updateComment(req, res)
);

// Delete a comment
router.delete(POST_ROUTES.COMMENT_BY_ID, (req, res) =>
  postController.deleteComment(req, res)
);

export default router;

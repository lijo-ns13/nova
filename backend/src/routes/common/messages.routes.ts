import express from "express";
import container from "../../di/container";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../../di/types";
import { IMessageController } from "../../interfaces/controllers/IMessageController";
import { IUserController } from "../../interfaces/controllers/IUserController";
import { MESSAGE_ROUTES } from "../../constants/routes/commonRoutes";

const messageController = container.get<IMessageController>(
  TYPES.MessageController
);

const userController = container.get<IUserController>(TYPES.UserController);
const router = express.Router();
router.get(MESSAGE_ROUTES.CHAT_USERS, (req, res) =>
  messageController.getChatUsers(req, res)
);
router.get(MESSAGE_ROUTES.USERNAME, (req, res) =>
  userController.getUser(req, res)
);
router.get(MESSAGE_ROUTES.CONVERSATION, (req, res) =>
  messageController.getConversation(req, res)
);

export default router;

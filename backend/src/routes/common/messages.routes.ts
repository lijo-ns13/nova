import express from "express";
import container from "../../di/container";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../../di/types";
import { IMessageController } from "../../interfaces/controllers/IMessageController";
// import messageModel from "../../repositories/models/message.model";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const messageController = container.get<IMessageController>(
  TYPES.MessageController
);
const router = express.Router();
router.get("/:userId/:otherUserId", (req, res) =>
  messageController.getConversation(req, res)
);
// router.get("/:userId/:otherUserId", async (req, res) => {
//   const { userId, otherUserId } = req.params;
//   console.log("userid,otheruserid", userId, otherUserId);
//   try {
//     const messages = await messageModel
//       .find({
//         $or: [
//           { sender: userId, receiver: otherUserId },
//           { sender: otherUserId, receiver: userId },
//         ],
//       })
//       .sort({ timestamp: 1 }); // ascending order

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

export default router;

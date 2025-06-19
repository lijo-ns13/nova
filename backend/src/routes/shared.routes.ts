import { Router, Request, Response } from "express";
import skillRouter from "./common/skill.routes";
import ProfileViewRouter from "./common/profile-view.routes";
import messageRoutes from "./common/messages.routes";
import messageModal from "../models/message.modal";
import notificationRouter from "./notification.routes";
import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
import userModal from "../models/user.modal";
import mongoose from "mongoose";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
router.use("/api/messages", messageRoutes);
router.use("/notification", notificationRouter);

router.get("/api/chat/users/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const timeWindowInDays = 30; // Customize the range, e.g., last 30 days
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - timeWindowInDays * 24 * 60 * 60 * 1000
  );

  try {
    const currentUser = await userModal
      .findById(userId)
      .select("following")
      .lean();
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const followingIds = currentUser.following.map((id) => id.toString());

    // Get unique userIds that had a conversation with current user in the time window
    const messagedUserDocs = await messageModal.aggregate([
      {
        $match: {
          createdAt: { $gte: pastDate },
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
          createdAt: 1,
          content: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    const messagedUserIds = messagedUserDocs.map((doc) => doc._id.toString());

    // Combine messaged users + followed users (remove duplicates)
    const uniqueUserIds = Array.from(
      new Set([...followingIds, ...messagedUserIds])
    );

    const users = await userModal
      .find({ _id: { $in: uniqueUserIds } })
      .select("_id name profilePicture online")
      .lean();

    // Attach lastMessage info to each user
    const usersWithLastMessages = users.map((user) => {
      const messageDoc = messagedUserDocs.find(
        (doc) => doc._id.toString() === user._id.toString()
      );
      return {
        ...user,
        lastMessage: messageDoc
          ? {
              content: messageDoc.lastMessage.content,
              createdAt: messageDoc.lastMessage.createdAt,
            }
          : null,
      };
    });

    // Sort by message time, fallback to alphabetical name sort for users with no messages
    const sortedUsers = usersWithLastMessages.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
});
router.get("/api/username/:otherUserId", async (req, res) => {
  const { otherUserId } = req.params;
  try {
    if (!otherUserId) {
      res.status(400).json({ success: false, message: "User ID not found" });
      return;
    }

    const user = await userModal.findById(otherUserId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});
export default router;

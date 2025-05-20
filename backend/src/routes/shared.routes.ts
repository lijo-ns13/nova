import { Router, Request, Response } from "express";
import skillRouter from "./common/skill.routes";
import ProfileViewRouter from "./common/profile-view.routes";
import messageRoutes from "./common/messages.routes";

import container from "../di/container";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
import userModal from "../models/user.modal";
const router = Router();
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
router.use("/api/messages", messageRoutes);

router.get("/api/chat/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const users = await userModal
      .find({ _id: { $ne: userId } })
      .select("_id name profilePicture online")
      .lean();

    res.status(200).json(users);
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

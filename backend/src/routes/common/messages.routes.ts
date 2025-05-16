// routes/message.routes.ts (or controller)
import express from "express";
import Message from "../../models/message.modal";
import userModal from "../../models/user.modal";
const router = express.Router();

router.get("/:userId/:otherUserId", async (req, res) => {
  const { userId, otherUserId } = req.params;
  console.log("userid,otheruserid", userId, otherUserId);
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); // ascending order

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;

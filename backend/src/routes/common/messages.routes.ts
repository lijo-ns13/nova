// routes/message.routes.ts (or controller)
import express from "express";
import Message from "../../models/message.modal";

const router = express.Router();

router.get("/:userId/:chatPartnerId", async (req, res) => {
  const { userId, chatPartnerId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: chatPartnerId },
        { sender: chatPartnerId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); // ascending order

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;

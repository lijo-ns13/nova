import { Router, Request, Response } from "express";
import skillRouter from "./common/skill.routes";
import ProfileViewRouter from "./common/profile-view.routes";
import messageRoutes from "./common/messages.routes";
import messageModal from "../models/message.modal";
import notificationRouter from "./notification.routes";

import userModal from "../models/user.modal";
import mongoose from "mongoose";
import { MediaService } from "../services/user/MediaService";
import mediaModal from "../models/media.modal";
import { MediaRepository } from "../repositories/mongo/MediaRepository";
const router = Router();
const mediaRepo = new MediaRepository(mediaModal);
const mediaService = new MediaService(mediaRepo);

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
router.use("/api/messages", messageRoutes);
router.use("/notification", notificationRouter);

router.get("/api/chat/users/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const timeWindowInDays = 30;
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
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    const messagedUserIds = messagedUserDocs.map((doc) => doc._id.toString());

    const uniqueUserIds = Array.from(
      new Set([...followingIds, ...messagedUserIds])
    );

    const users = await userModal
      .find({ _id: { $in: uniqueUserIds } })
      .select("_id name profilePicture online")
      .lean();

    // ✅ Generate signed URLs for profile pictures
    const usersWithSignedProfilePics = await Promise.all(
      users.map(async (user) => {
        let profilePictureUrl = null;
        if (user.profilePicture) {
          try {
            profilePictureUrl = await mediaService.getMediaUrl(
              user.profilePicture
            );
          } catch (err) {
            console.warn(`Failed to get signed URL for user ${user._id}:`, err);
          }
        }

        const messageDoc = messagedUserDocs.find(
          (doc) => doc._id.toString() === user._id.toString()
        );

        return {
          ...user,
          profilePicture: profilePictureUrl, // ✅ replace s3Key with signed URL
          lastMessage: messageDoc
            ? {
                content: messageDoc.lastMessage.content,
                createdAt: messageDoc.lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    // Sort by message time, fallback to alphabetical name sort
    const sortedUsers = usersWithSignedProfilePics.sort((a, b) => {
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
// GET /media/stream/:s3key
// import { S3 } from "aws-sdk";
// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import mediaModal from "../models/media.modal";
// const s3 = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// router.post("/api/view-doc", async (req, res) => {
//   try {
//     const { mediaId } = req.body; // e.g. "secure/myfile.pdf"
//     const media = await mediaModal.findById(mediaId);
//     if (!media) {
//       throw new Error("media not found");
//     }
//     const s3Key = media.s3Key;
//     // (Optional) Verify user access here...

//     // Generate signed URL
//     const command = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: s3Key,
//     });

//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1 min

//     // Fetch the file using axios
//     const fileResponse = await axios.get(signedUrl, { responseType: "stream" });

//     res.setHeader("Content-Type", fileResponse.headers["content-type"]);
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename="${s3Key.split("/").pop()}"`
//     );

//     fileResponse.data.pipe(res);
//   } catch (error) {
//     console.error("Error streaming S3 file:", error);
//     res.status(500).json({ message: "Failed to load document" });
//   }
// });
export default router;

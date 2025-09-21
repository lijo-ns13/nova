import { Router, Request, Response } from "express";
import skillRouter from "./skill.routes";
import ProfileViewRouter from "./profile-view.routes";
import messageRoutes from "./messages.routes";

import notificationRouter from "./notification.routes";

// import mongoose from "mongoose";
// import { MediaRepository } from "../../repositories/mongo/MediaRepository";
// import mediaModel from "../../repositories/models/media.model";
// import { MediaService } from "../../services/user/MediaService";
// import userModel from "../../repositories/models/user.model";
// import messageModel from "../../repositories/models/message.model";

const router = Router();
// const mediaRepo = new MediaRepository(mediaModel);
// const mediaService = new MediaService(mediaRepo);

router.use("/skill", skillRouter);
router.use("/api", ProfileViewRouter);
router.use("/messages", messageRoutes);
router.use("/notification", notificationRouter);

// router.get("/api/chat/users/:userId", async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const timeWindowInDays = 30;
//   const now = new Date();
//   const pastDate = new Date(
//     now.getTime() - timeWindowInDays * 24 * 60 * 60 * 1000
//   );

//   try {
//     const currentUser = await userModel
//       .findById(userId)
//       .select("following")
//       .lean();
//     if (!currentUser) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const followingIds = currentUser.following.map((id) => id.toString());

//     const messagedUserDocs = await messageModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: pastDate },
//           $or: [
//             { sender: new mongoose.Types.ObjectId(userId) },
//             { receiver: new mongoose.Types.ObjectId(userId) },
//           ],
//         },
//       },
//       {
//         $project: {
//           otherUser: {
//             $cond: [
//               { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
//               "$receiver",
//               "$sender",
//             ],
//           },
//           createdAt: 1,
//           content: 1,
//         },
//       },
//       { $sort: { createdAt: -1 } },
//       {
//         $group: {
//           _id: "$otherUser",
//           lastMessage: { $first: "$$ROOT" },
//         },
//       },
//     ]);

//     const messagedUserIds = messagedUserDocs.map((doc) => doc._id.toString());

//     const uniqueUserIds = Array.from(
//       new Set([...followingIds, ...messagedUserIds])
//     );

//     const users = await userModel
//       .find({ _id: { $in: uniqueUserIds } })
//       .select("_id name profilePicture online")
//       .lean();

//     // ✅ Generate signed URLs for profile pictures
//     const usersWithSignedProfilePics = await Promise.all(
//       users.map(async (user) => {
//         let profilePictureUrl = null;
//         if (user.profilePicture) {
//           try {
//             profilePictureUrl = await mediaService.getMediaUrl(
//               user.profilePicture
//             );
//           } catch (err) {
//             console.warn(`Failed to get signed URL for user ${user._id}:`, err);
//           }
//         }

//         const messageDoc = messagedUserDocs.find(
//           (doc) => doc._id.toString() === user._id.toString()
//         );

//         return {
//           ...user,
//           profilePicture: profilePictureUrl, // ✅ replace s3Key with signed URL
//           lastMessage: messageDoc
//             ? {
//                 content: messageDoc.lastMessage.content,
//                 createdAt: messageDoc.lastMessage.createdAt,
//               }
//             : null,
//         };
//       })
//     );

//     // Sort by message time, fallback to alphabetical name sort
//     const sortedUsers = usersWithSignedProfilePics.sort((a, b) => {
//       const aTime = a.lastMessage?.createdAt
//         ? new Date(a.lastMessage.createdAt).getTime()
//         : 0;
//       const bTime = b.lastMessage?.createdAt
//         ? new Date(b.lastMessage.createdAt).getTime()
//         : 0;
//       return bTime - aTime;
//     });

//     res.status(200).json(sortedUsers);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Failed to get users" });
//   }
// });

// router.get("/api/username/:otherUserId", async (req, res) => {
//   const { otherUserId } = req.params;
//   try {
//     if (!otherUserId) {
//       res.status(400).json({ success: false, message: "User ID not found" });
//       return;
//     }

//     const user = await userModel.findById(otherUserId);
//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       profilePicture: user.profilePicture,
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Failed to get user" });
//   }
// });
export default router;

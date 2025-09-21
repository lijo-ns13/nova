import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { IMessage } from "../entities/message.entity";
import { IMessageRepository } from "../../interfaces/repositories/IMessageRepository";
import userModel from "../models/user.model";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor(
    @inject(TYPES.MessageModel) private messageModel: Model<IMessage>
  ) {
    super(messageModel);
  }
  async getChatUsersWithLastMessage(
    userId: string,
    daysWindow = 100
  ): Promise<any[]> {
    const now = new Date();
    const pastDate = new Date(now.getTime() - daysWindow * 24 * 60 * 60 * 1000);

    const currentUser = await userModel
      .findById(userId)
      .select("following")
      .lean();
    if (!currentUser) return [];

    const followingIds = currentUser.following.map((id) => id.toString());

    const messagedUserDocs = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: pastDate },
          $or: [
            { sender: new Types.ObjectId(userId) },
            { receiver: new Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$sender", new Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
          content: 1,
          createdAt: 1,
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

    const users = await userModel
      .find({ _id: { $in: uniqueUserIds } })
      .select("_id name profilePicture online")
      .lean();

    // Combine user info with last message
    return users.map((user) => {
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
  }
  async findConversation(
    userId: string,
    otherUserId: string
  ): Promise<IMessage[]> {
    return this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 }); // ascending order
  }
  async getConversation(
    userId: Types.ObjectId,
    otherUserId: Types.ObjectId
  ): Promise<IMessage[]> {
    return this.messageModel
      .find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  //   async createMessage(data: Partial<IMessage>): Promise<IMessage> {
  //     const message = new this.messageModel(data);
  //     return message.save();
  //   }

  //   async markAsRead(messageId: Types.ObjectId): Promise<void> {
  //     await this.messageModel.updateOne({ _id: messageId }, { $set: { isRead: true } }).exec();
  //   }
}

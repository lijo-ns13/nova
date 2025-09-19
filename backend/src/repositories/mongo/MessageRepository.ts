import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { IMessage } from "../entities/message.entity";
import { IMessageRepository } from "../../interfaces/repositories/IMessageRepository";

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

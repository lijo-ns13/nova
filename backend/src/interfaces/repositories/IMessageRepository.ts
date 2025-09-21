import { Types } from "mongoose";
import { IMessage } from "../../repositories/entities/message.entity";

export interface IMessageRepository {
  getConversation(
    userId: Types.ObjectId,
    otherUserId: Types.ObjectId
  ): Promise<IMessage[]>;
  getChatUsersWithLastMessage(
    userId: string,
    daysWindow: number
  ): Promise<any[]>;
  findConversation(userId: string, otherUserId: string): Promise<IMessage[]>;
  //   createMessage(data: Partial<IMessage>): Promise<IMessage>;
  //   markAsRead(messageId: Types.ObjectId): Promise<void>;
}

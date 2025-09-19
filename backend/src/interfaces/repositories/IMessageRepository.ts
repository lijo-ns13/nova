import { Types } from "mongoose";
import { IMessage } from "../../repositories/entities/message.entity";

export interface IMessageRepository {
  getConversation(
    userId: Types.ObjectId,
    otherUserId: Types.ObjectId
  ): Promise<IMessage[]>;
  //   createMessage(data: Partial<IMessage>): Promise<IMessage>;
  //   markAsRead(messageId: Types.ObjectId): Promise<void>;
}

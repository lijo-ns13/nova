import { IMessage } from "../../repositories/entities/message.entity";

export interface IMessageService {
  getConversation(userId: string, otherUserId: string): Promise<IMessage[]>;
  //   sendMessage(data: { sender: string; receiver: string; content: string }): Promise<IMessage>;
  //   markMessageAsRead(messageId: string): Promise<void>;
}

import { MessageDTO } from "../../core/dtos/user/message.response.dto";

export interface IMessageService {
  getChatUsers(userId: string): Promise<any>;
  getConversation(userId: string, otherUserId: string): Promise<MessageDTO[]>;
  //   sendMessage(data: { sender: string; receiver: string; content: string }): Promise<IMessage>;
  //   markMessageAsRead(messageId: string): Promise<void>;
}

import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { IMessageRepository } from "../../interfaces/repositories/IMessageRepository";
import { IMessage } from "../../repositories/entities/message.entity";
import { IMessageService } from "../../interfaces/services/IMessageService";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository
  ) {}

  async getConversation(
    userId: string,
    otherUserId: string
  ): Promise<IMessage[]> {
    return this._messageRepo.getConversation(
      new Types.ObjectId(userId),
      new Types.ObjectId(otherUserId)
    );
  }

  //   async sendMessage(data: { sender: string; receiver: string; content: string }): Promise<IMessage> {
  //     return this._messageRepo.createMessage({
  //       sender: new Types.ObjectId(data.sender),
  //       receiver: new Types.ObjectId(data.receiver),
  //       content: data.content,
  //       isRead: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });
  //   }

  //   async markMessageAsRead(messageId: string): Promise<void> {
  //     await this._messageRepo.markAsRead(new Types.ObjectId(messageId));
  //   }
}

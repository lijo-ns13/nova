import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { IMessageRepository } from "../../interfaces/repositories/IMessageRepository";
import { IMessage } from "../../repositories/entities/message.entity";
import { IMessageService } from "../../interfaces/services/IMessageService";
import { MessageDTO } from "../../core/dtos/user/message.response.dto";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService
  ) {}

  async getChatUsers(userId: string) {
    const users = await this._messageRepo.getChatUsersWithLastMessage(
      userId,
      100
    );

    // Generate signed URLs for profile pictures
    const usersWithSignedProfilePics = await Promise.all(
      users.map(async (user) => {
        let profilePictureUrl = null;
        if (user.profilePicture) {
          try {
            profilePictureUrl = await this._mediaService.getMediaUrl(
              user.profilePicture
            );
          } catch (err) {
            console.warn(`Failed to get signed URL for user ${user._id}:`, err);
          }
        }
        return {
          ...user,
          profilePicture: profilePictureUrl,
        };
      })
    );

    // Sort by last message time (newest first), fallback to name
    return usersWithSignedProfilePics.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });
  }
  async getConversation(
    userId: string,
    otherUserId: string
  ): Promise<MessageDTO[]> {
    const messages = await this._messageRepo.findConversation(
      userId,
      otherUserId
    );
    return messages.map((msg) => ({
      _id: msg._id,
      sender: msg.sender,
      receiver: msg.receiver,
      content: msg.content,
      isRead: msg.isRead,
      createdAt: msg.createdAt!,
      updatedAt: msg.updatedAt!,
    }));
  }
}

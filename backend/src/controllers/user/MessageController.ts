import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IMessageService } from "../../interfaces/services/IMessageService";

@injectable()
export class MessageController {
  constructor(
    @inject(TYPES.MessageService) private _messageService: IMessageService
  ) {}

  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { userId, otherUserId } = req.params;
      const messages = await this._messageService.getConversation(
        userId,
        otherUserId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: messages });
    } catch (error) {
      handleControllerError(error, res, "MessageController::getConversation");
    }
  }

  //   async sendMessage(req: Request, res: Response): Promise<void> {
  //     try {
  //       const { sender, receiver, content } = req.body;
  //       const message = await this._messageService.sendMessage({ sender, receiver, content });
  //       res.status(HTTP_STATUS_CODES.CREATED).json({ success: true, data: message });
  //     } catch (error) {
  //       handleControllerError(error, res, "MessageController::sendMessage");
  //     }
  //   }

  //   async markAsRead(req: Request, res: Response): Promise<void> {
  //     try {
  //       const { messageId } = req.params;
  //       await this._messageService.markMessageAsRead(messageId);
  //       res.status(HTTP_STATUS_CODES.OK).json({ success: true });
  //     } catch (error) {
  //       handleControllerError(error, res, "MessageController::markAsRead");
  //     }
  //   }
}

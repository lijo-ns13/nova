import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IMessageService } from "../../interfaces/services/IMessageService";

@injectable()
export class MessageController {
  constructor(
    @inject(TYPES.MessageService)
    private readonly _messageService: IMessageService
  ) {}
  async getChatUsers(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const users = await this._messageService.getChatUsers(userId);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: users });
    } catch (error) {
      handleControllerError(error, res, "MessageController::getChatUsers");
    }
  }
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
}

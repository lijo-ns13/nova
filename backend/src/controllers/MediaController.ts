import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import { IMediaService } from "../interfaces/services/Post/IMediaService";
import { IMediaController } from "../interfaces/controllers/IMediaController";

interface Userr {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class MediaController implements IMediaController {
  constructor(
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  // GET /api/media/view/:mediaId
  async getMediaByS3(req: Request, res: Response): Promise<void> {
    try {
      const { s3key } = req.params;
      if (!s3key) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: "s3key not found" });
        return;
      }
      const user = req.user as Userr;
      const media = await this.mediaService.getMediaDataByS3KEY(s3key);
      if (!media) {
        res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .json({ message: "media not found" });
        return;
      }

      const signedUrl = await this.mediaService.getMediaUrl(s3key);

      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ url: signedUrl, mimeTYpe: media.mimeType });
    } catch (error) {
      console.log("Error getting media URL:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Failed to get media",
      });
    }
  }
}

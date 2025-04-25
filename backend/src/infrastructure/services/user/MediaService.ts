// infrastructure/services/MediaService.ts
import { injectable } from "inversify";
import AWS from "aws-sdk";
import { IMediaService } from "../../../core/interfaces/services/Post/IMediaService";
import mediaModal, { IMedia } from "../../database/models/media.modal";
import { Types } from "mongoose";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION,
});

@injectable()
export class MediaService implements IMediaService {
  async uploadMedia(
    files: Express.Multer.File[],
    ownerId: string
  ): Promise<string[]> {
    const mediaIds: string[] = [];

    for (const file of files) {
      const s3Key = `${Date.now()}-${file.originalname}`;
      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const s3Upload = await s3.upload(s3Params).promise();

      const mediaDoc: IMedia = await mediaModal.create({
        url: s3Upload.Location,
        mimeType: file.mimetype,
        ownerId,
        ownerModel: "User",
      });

      mediaIds.push((mediaDoc._id as Types.ObjectId).toString());
    }

    return mediaIds;
  }
}

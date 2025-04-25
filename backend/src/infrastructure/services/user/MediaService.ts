import { injectable } from "inversify";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IMediaService } from "../../../core/interfaces/services/Post/IMediaService";
import mediaModal, { IMedia } from "../../database/models/media.modal";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

@injectable()
export class MediaService implements IMediaService {
  private readonly MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
  private readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
  ];

  async uploadMedia(
    files: Express.Multer.File[],
    ownerId: string,
    ownerModel: string
  ): Promise<string[]> {
    try {
      return await Promise.all(
        files.map(async (file) => {
          // Validate file type
          if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new Error(`Unsupported file type: ${file.mimetype}`);
          }

          // Validate file size
          if (file.size > this.MAX_FILE_SIZE) {
            throw new Error(
              `File too large: ${file.originalname} (Max ${
                this.MAX_FILE_SIZE / 1024 / 1024
              }MB)`
            );
          }

          const fileKey = `media/${uuidv4()}-${file.originalname}`;

          await s3.send(
            new PutObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: fileKey,
              Body: file.buffer,
              ContentType: file.mimetype,
              ACL: "private",
            })
          );

          const mediaDoc = await mediaModal.create({
            s3Key: fileKey,
            mimeType: file.mimetype,
            ownerId,
            ownerModel,
          });

          return mediaDoc._id.toString();
        })
      );
    } catch (error) {
      throw new Error(`Media upload failed: `);
    }
  }

  async getMediaUrl(s3Key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: s3Key,
      });
      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (error) {
      throw new Error(`Failed to generate URL`);
    }
  }

  async deleteMedia(mediaIds: string[]): Promise<void> {
    try {
      const mediaRecords = await mediaModal.find({
        _id: { $in: mediaIds.map((id) => new Types.ObjectId(id)) },
      });

      await Promise.all([
        // Delete from S3
        ...mediaRecords.map((media) =>
          s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: media.s3Key,
            })
          )
        ),
        // Delete from DB
        mediaModal.deleteMany({ _id: { $in: mediaIds } }),
      ]);
    } catch (error) {
      throw new Error(`Media deletion failed`);
    }
  }
}

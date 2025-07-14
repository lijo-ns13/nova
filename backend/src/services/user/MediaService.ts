import { inject, injectable } from "inversify";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import mediaModal, { IMedia } from "../../models/media.modal";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { IMediaRepository } from "../../interfaces/repositories/IMediaRepository";
export interface MediaUrlDTO {
  url: string;
  mimeType:
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "video/mp4"
    | "video/quicktime"
    | "application/pdf";
}
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

@injectable()
export class MediaService implements IMediaService {
  constructor(
    @inject(TYPES.MediaRepository) private _mediaRepo: IMediaRepository
  ) {}
  private readonly MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
  private readonly ALLOWED_MIME_TYPES = [
    "image/jpeg", // JPEG image
    "image/png", // PNG image
    "image/webp", // WebP image
    "video/mp4", // MP4 video
    "video/quicktime", // QuickTime video
    "application/pdf", // PDF document
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
      const err = error as Error;
      throw new Error(`Media upload failed:${err.message} `);
    }
  }
  async uploadSingleMedia(
    file: Express.Multer.File,
    ownerId: string,
    ownerModel: string
  ): Promise<string> {
    try {
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

      // Generate S3 key
      const fileKey = `media/${uuidv4()}-${file.originalname}`;

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "private",
        })
      );

      // Optional: Save in MongoDB
      await mediaModal.create({
        s3Key: fileKey,
        mimeType: file.mimetype,
        ownerId,
        ownerModel,
      });

      // Return S3 key directly
      return fileKey;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Single media upload failed: ${err.message}`);
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
      if (!mediaIds || mediaIds.length === 0) {
        throw new Error("No media IDs provided for deletion");
      }

      // Convert string IDs to ObjectId and validate
      const objectIds = mediaIds.map((id) => {
        try {
          return new Types.ObjectId(id);
        } catch (error) {
          throw new Error(`Invalid media ID format: ${id}`);
        }
      });

      // Find all media records
      const mediaRecords = await mediaModal.find({
        _id: { $in: objectIds },
      });

      if (mediaRecords.length === 0) {
        console.warn("No media records found for the provided IDs");
        return;
      }

      // Delete from S3
      const s3Deletions = mediaRecords.map(async (media) => {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: media.s3Key,
            })
          );
          console.log(`Successfully deleted from S3: ${media.s3Key}`);
        } catch (s3Error) {
          console.error(`Failed to delete from S3: ${media.s3Key}`, s3Error);
          throw new Error(`S3 deletion failed for key: ${media.s3Key}`);
        }
      });

      // Delete from MongoDB
      const dbDeletion = mediaModal.deleteMany({ _id: { $in: objectIds } });

      // Wait for all operations to complete
      await Promise.all([...s3Deletions, dbDeletion]);

      console.log(`Successfully deleted ${mediaRecords.length} media items`);
    } catch (error) {
      console.error("Detailed media deletion error:", error);
      throw new Error(`Media deletion failed: ${(error as Error).message}`);
    }
  }
  // updated any issue remove this
  async getMediaById(mediaId: string): Promise<IMedia | null> {
    return this._mediaRepo.findById(mediaId);
  }
  async getMediaDataByS3KEY(s3Key: string): Promise<IMedia | null> {
    return this._mediaRepo.findOne({ s3Key: s3Key });
  }
  async getMediaUrlById(mediaId: string): Promise<MediaUrlDTO> {
    const media = await this._mediaRepo.findById(mediaId);

    if (!media) {
      throw new Error(`Media not found with ID: ${mediaId}`);
    }

    const signedUrl = await this.getMediaUrl(media.s3Key);

    return {
      url: signedUrl,
      mimeType: media.mimeType,
    };
  }
}

// core/interfaces/services/IMediaService.ts
import { Express } from "express";
import { IMedia } from "../../../models/media.modal";
import { MediaUrlDTO } from "../../../services/user/MediaService";

export interface IMediaService {
  uploadMedia(
    files: Express.Multer.File[],
    ownerId: string,
    ownerModel: "User" | "Company"
  ): Promise<string[]>; // return media IDs
  uploadSingleMedia(
    file: Express.Multer.File,
    ownerId?: string,
    ownerModel?: string
  ): Promise<string>;
  getMediaUrl(s3Key: string): Promise<string>;
  deleteMedia(mediaIds: string[]): Promise<void>;
  getMediaById(mediaId: string): Promise<IMedia | null>;
  getMediaDataByS3KEY(s3Key: string): Promise<IMedia | null>;
  getMediaUrlById(mediaId: string): Promise<MediaUrlDTO>;
}

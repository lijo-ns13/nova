// core/interfaces/services/IMediaService.ts
import { Express } from "express";

export interface IMediaService {
  uploadMedia(
    files: Express.Multer.File[],
    ownerId: string,
    ownerModel: "User" | "Company"
  ): Promise<string[]>; // return media IDs
}

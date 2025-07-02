// src/interfaces/controllers/ICloudinaryController.ts
import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import { ICloudinaryService } from "../services/ClaudinaryService";
import { TYPES } from "../di/types";
import { inject, injectable } from "inversify";

// interfaces/controllers/ICloudinaryController.ts
export interface ICloudinaryController {
  generateMedia(req: Request, res: Response): Promise<void>;
  uploadMedia(req: Request, res: Response): Promise<void>;
}
interface Userr {
  id: string;
  email: string;
  role: string;
}
// controllers/CloudinaryController.ts
@injectable()
export class CloudinaryController implements ICloudinaryController {
  constructor(
    @inject(TYPES.CloudinaryService)
    private cloudinaryService: ICloudinaryService
  ) {}

  async uploadMedia(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?.id;
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      if (!req.file || !req.file.buffer) {
        res.status(400).json({ success: false, message: "No file provided" });
        return;
      }

      const publicId = await this.cloudinaryService.uploadFile(
        req.file.buffer,
        "secure_files",
        userId.toString()
      );

      res.status(200).json({ success: true, publicId });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async generateMedia(req: Request, res: Response): Promise<void> {
    try {
      const publicId = req.params.publicId;
      if (!publicId) {
        res.status(400).json({ success: false, message: "Missing publicId" });
        return;
      }

      const signedUrl = await this.cloudinaryService.generateSignedUrl(
        publicId
      );
      res.status(200).json({ url: signedUrl });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

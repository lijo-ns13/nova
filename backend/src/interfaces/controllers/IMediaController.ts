import { Request, Response } from "express";

export interface IMediaController {
  getMediaByS3(req: Request, res: Response): Promise<void>;
  streamMediaById(req: Request, res: Response): Promise<void>;
}

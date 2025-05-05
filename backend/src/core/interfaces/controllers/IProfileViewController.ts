// src/core/interfaces/controllers/IProfileViewController.ts

import { Request, Response } from "express";

export interface IProfileViewController {
  /**
   * Handles the request to search for a user's basic profile data including skills.
   * @param req The Express request object containing the username in the body.
   * @param res The Express response object used to return the data or error message.
   */
  getUserBasicData(req: Request, res: Response): Promise<void>;
  getUserPostData(req: Request, res: Response): Promise<void>
}

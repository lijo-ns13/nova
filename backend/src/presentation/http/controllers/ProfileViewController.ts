import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { IProfileViewService } from "../../../core/interfaces/services/IProfileViewService";
import { HTTP_STATUS_CODES } from "../../../core/enums/httpStatusCode";
import { IProfileViewController } from "../../../core/interfaces/controllers/IProfileViewController";

@injectable()
export class ProfileViewController implements IProfileViewController {
  constructor(
    @inject(TYPES.ProfileViewService)
    private _profileViewService: IProfileViewService
  ) {}

  async getUserBasicData(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const userData = await this._profileViewService.getUserBasicData(
        username
      );
      res.status(HTTP_STATUS_CODES.OK).json(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }
  async getUserPostData(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userData = await this._profileViewService.getUserPostData(
        page,
        limit,
        username
      );
      res.status(HTTP_STATUS_CODES.OK).json(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }
}

import { inject, injectable } from "inversify";

import { Request, Response } from "express";
import { IUserSkillController } from "../../interfaces/controllers/IUserSkillController";
import { IUserSkillService } from "../../interfaces/services/IUserSkillService";
import { TYPES } from "../../di/types";
import { ISkillService } from "../../interfaces/services/ISkillService";
interface Userr {
  id: string;
  email: string;
  role: string;
}
@injectable()
export class UserSkillController implements IUserSkillController {
  constructor(
    @inject(TYPES.UserSkillService)
    private _userSkillService: IUserSkillService,
    @inject(TYPES.SkillService) private _skillService: ISkillService
  ) {}

  async getUserSkills(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?.id;
      const skills = await this._userSkillService.getUserSkills(userId);
      res.status(200).json({ success: true, data: skills });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to get skills", error });
    }
  }

  async addSkills(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id;
      const { skills } = req.body; // ["Java", "React"]
      const updatedUser = await this._userSkillService.addSkills(
        userId,
        skills
      );
      res.status(200).json({ success: true, data: updatedUser?.skills });
    } catch (error) {
      console.error("Failed to add skills:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add skills", error });
    }
  }

  async deleteSkill(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?.id;
      const skillId = req.params.skillId;
      const updatedUser = await this._userSkillService.deleteSkill(
        userId,
        skillId
      );
      res.status(200).json({ success: true, data: updatedUser?.skills });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete skill", error });
    }
  }
}

import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { ISkillService } from "../interfaces/services/ISkillService";
import { ISkillController } from "../interfaces/controllers/ISkillController";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";

interface Userr {
  _id: string;
  email: string;
  role: string;
}
@injectable()
export class SkillController implements ISkillController {
  constructor(
    @inject(TYPES.SkillService) private skillService: ISkillService
  ) {}

  async searchSkills(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.q as string) || "";
      const skills = await this.skillService.searchSkills(query);
      res.status(HTTP_STATUS_CODES.OK).json(skills); // Removed 'return'
    } catch (error) {
      console.error("Error fetching skills:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" }); // Removed 'return'
    }
  }
  async addSkill(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.body;
      const userId = (req.user as Userr)?._id;

      await this.skillService.addSkillToUser(userId, title);
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Skill added" });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to add skill" });
    }
  }

  async removeSkill(req: Request, res: Response): Promise<void> {
    try {
      const { skillId } = req.body;
      const userId = (req.user as Userr)?._id;

      await this.skillService.deleteSkillFromUser(userId, skillId);
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Skill removed" });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to remove skill" });
    }
  }
  async getUserSkills(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)._id;

      const skills = await this.skillService.getUserSkills(userId);

      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: skills });
    } catch (error) {
      console.error("Error fetching user skills:", error);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to fetch user skills" });
    }
  }
}

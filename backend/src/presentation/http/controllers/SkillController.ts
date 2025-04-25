import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { ISkillService } from "../../../core/interfaces/services/ISkillService";
import { ISkillController } from "../../../core/interfaces/controllers/ISkillController";

@injectable()
export class SkillController implements ISkillController {
  constructor(
    @inject(TYPES.SkillService) private skillService: ISkillService
  ) {}

  async searchSkills(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.q as string) || "";
      const skills = await this.skillService.searchSkills(query);
      res.status(200).json(skills); // Removed 'return'
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Internal Server Error" }); // Removed 'return'
    }
  }
}

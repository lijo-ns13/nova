import { Request, Response } from "express";

export interface IUserSkillController {
  addSkill(req: Request, res: Response): Promise<void>;
  removeSkill(req: Request, res: Response): Promise<void>;
  getUserSkills(req: Request, res: Response): Promise<void>;
}

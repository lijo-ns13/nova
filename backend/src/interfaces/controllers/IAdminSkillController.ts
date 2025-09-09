import { RequestHandler } from "express";

export interface IAdminSkillController {
  createSkill: RequestHandler;
  updateSkill: RequestHandler;
  deleteSkill: RequestHandler;
  getAllSkill: RequestHandler;
  getByIdSkill: RequestHandler;
}

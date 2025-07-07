import { RequestHandler } from "express";

export interface IAdminSkillController {
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
  getAll: RequestHandler;
  getById: RequestHandler;
}

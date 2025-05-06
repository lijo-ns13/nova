import { inject, injectable } from "inversify";
import { ISkillRepository } from "../core/interfaces/repositories/ISkillRepository";
import { TYPES } from "../di/types";
import { ISkillService } from "../core/interfaces/services/ISkillService";

@injectable()
export class SkillService implements ISkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository
  ) {}
  async searchSkills(query: string): Promise<string[]> {
    if (!query.trim()) return [];
    return this._skillRepository.searchSkills(query);
  }
}

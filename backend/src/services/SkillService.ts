import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { SkillResponseDTO } from "../dtos/response/skill.response.dto";
import { ISkillRepository } from "../interfaces/repositories/ISkillRepository";
import { ISkillService } from "../interfaces/services/ISkillService";
import { SkillMapper } from "../mapping/skill.mapper";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";

@injectable()
export class SkillService implements ISkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async searchSkills(query: string): Promise<SkillResponseDTO[]> {
    if (!query.trim()) return [];
    const skills = await this._skillRepository.searchSkills(query, 10);
    return SkillMapper.toSearchListDTO(skills);
  }

  async getByTitle(title: string): Promise<SkillResponseDTO | null> {
    const skill = await this._skillRepository.getByTitle(
      title.trim().toLowerCase()
    );
    return skill ? SkillMapper.toResponseDTO(skill) : null;
  }

  async getOrCreateSkills(
    skillTitles: string[],
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<SkillResponseDTO[]> {
    const result: SkillResponseDTO[] = [];

    for (const titleRaw of skillTitles) {
      const title = titleRaw.trim().toLowerCase();

      let skill = await this._skillRepository.findByTitle(title);

      if (!skill) {
        skill = await this._skillRepository.createSkill(
          title,
          createdById,
          createdBy
        );
      }

      result.push(SkillMapper.toResponseDTO(skill));
    }

    return result;
  }

  async findOrCreateSkillByTitle(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<SkillResponseDTO> {
    const normalized = title.trim().toLowerCase();

    let skill = await this._skillRepository.findByTitle(normalized);

    if (!skill) {
      skill = await this._skillRepository.createSkill(
        normalized,
        createdById,
        createdBy
      );
    }

    return SkillMapper.toResponseDTO(skill);
  }
}

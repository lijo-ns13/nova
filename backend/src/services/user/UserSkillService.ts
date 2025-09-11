import { inject, injectable } from "inversify";
import { IUserSkillService } from "../../interfaces/services/IUserSkillService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { ISkillRepository } from "../../interfaces/repositories/ISkillRepository";
import { TYPES } from "../../di/types";
import { SkillUserResponseDTO } from "../../dtos/response/user.skill.response.dto";
import { SkillUserMapper } from "../../mapping/user.skill.mapper";

@injectable()
export class UserSkillService implements IUserSkillService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.SkillRepository) private _skillRepo: ISkillRepository
  ) {}

  async addSkillToUser(
    userId: string,
    title: string
  ): Promise<SkillUserResponseDTO[]> {
    const normalized = title.trim().toLowerCase();
    let skill = await this._skillRepo.getByTitle(normalized);

    if (!skill) {
      skill = await this._skillRepo.createSkillWith(normalized, userId, "user");
    }

    await this._userRepo.addSkillToUser(userId, skill._id.toString());
    const skills = await this._userRepo.getUserSkills(userId);
    return skills.map(SkillUserMapper.toDTO);
  }

  async deleteSkillFromUser(userId: string, skillId: string): Promise<void> {
    await this._userRepo.deleteUserSkill(userId, skillId);
  }

  async getUserSkills(userId: string): Promise<SkillUserResponseDTO[]> {
    const skills = await this._userRepo.getUserSkills(userId);
    return skills.map(SkillUserMapper.toDTO);
  }
}

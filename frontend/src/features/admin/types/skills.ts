export interface ISkill {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSkillDto = Pick<ISkill, "title">;
export type UpdateSkillDto = Partial<CreateSkillDto>;

export interface ISkill {
  id: string;
  title: string;
  createdBy: "admin" | "user" | "company";
}
// export interface SkillResponseDto {
//   id: string;
//   title: string;
//   createdBy: "admin" | "user" | "company";
// }

export type PaginatedSkillResponse = {
  skills: ISkill[];
  total: number;
  page: number;
  limit: number;
};
export interface CreateSkillDto {
  title: string;
}

export interface UpdateSkillDto {
  title: string;
}

export interface SkillWithCreatorEmail {
  id: string;
  title: string;
  createdBy: {
    id: string;
    email: string;
  };
}


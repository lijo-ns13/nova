export interface ISkill {
  id: string;
  title: string;
  createdBy: string;
}

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

export interface PaginatedSkillResponse {
  skills: ISkill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

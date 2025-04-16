import adminAxios from "../../../utils/adminAxios";
import { ISkill, CreateSkillDto, UpdateSkillDto } from "../types/skills";
const API_BASE_URL = "http://localhost:3000/admin/skills";

export const SkillService = {
  async createSkill(data: CreateSkillDto): Promise<ISkill> {
    const response = await adminAxios.post<ISkill>(
      API_BASE_URL,
      { title: data.title },
      { withCredentials: true }
    );
    return response.data;
  },

  async getSkills(): Promise<ISkill[]> {
    const response = await adminAxios.get<ISkill[]>(API_BASE_URL);
    return response.data;
  },

  async getSkillById(id: string): Promise<ISkill> {
    const response = await adminAxios.get<ISkill>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  async updateSkill(id: string, data: UpdateSkillDto): Promise<ISkill> {
    const response = await adminAxios.patch<ISkill>(
      `${API_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  async deleteSkill(id: string): Promise<void> {
    await adminAxios.delete(`${API_BASE_URL}/${id}`);
  },
};

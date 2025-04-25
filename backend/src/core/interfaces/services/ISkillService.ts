export interface ISkillService {
  searchSkills(query: string): Promise<string[]>;
}

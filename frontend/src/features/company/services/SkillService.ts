import apiAxios from "../../../utils/apiAxios";

export type Skill = { id: string; title: string };

export async function searchSkills(query: string): Promise<string[]> {
  if (!query || query.trim().length < 1) return [];

  const { data } = await apiAxios.get<{ success: boolean; data: Skill[] }>(
    `/skill/search?q=${encodeURIComponent(query)}`,
    { withCredentials: true }
  );

  const lowerQuery = query.toLowerCase();
  return data.data
    .filter((skill) => skill.title.toLowerCase().includes(lowerQuery))
    .slice(0, 5)
    .map((skill) => skill.title);
}

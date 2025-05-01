import adminAxios from "../../../utils/adminAxios";
const API_BASE_URL = "http://localhost:3000/admin/companies";

export const getCompanies = async (
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  const response = await adminAxios.get(
    `${API_BASE_URL}?${params.toString()}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const blockCompany = async (companyId: string) => {
  const response = await adminAxios.patch(`${API_BASE_URL}/block/${companyId}`);
  return response.data.company;
};

export const unblockCompany = async (companyId: string) => {
  const response = await adminAxios.patch(
    `${API_BASE_URL}/unblock/${companyId}`
  );
  return response.data.company;
};

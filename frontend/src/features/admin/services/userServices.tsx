import adminAxios from "../../../utils/adminAxios";
const BASE_URL = "http://localhost:3000/admin";
export const getUsers = async (
  page: number,
  limit: number,
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
    `${BASE_URL}/users?${params.toString()}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const blockUser = async (userId: string) => {
  const response = await adminAxios.patch(`${BASE_URL}/users/block/${userId}`);
  return response.data;
};

export const unblockUser = async (userId: string) => {
  const response = await adminAxios.patch(
    `${BASE_URL}/users/unblock/${userId}`
  );
  return response.data;
};

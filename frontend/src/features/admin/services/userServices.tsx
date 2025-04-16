import adminAxios from "../../../utils/adminAxios";
const BASE_URL = "http://localhost:3000/admin";
export const getUsers = async (page: number = 1, limit: number = 10) => {
  const response = await adminAxios.get(
    `${BASE_URL}/users?page=${page}&limit=${limit}`
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

// src/utils/getUserSocketData.ts
import userModal from "../models/user.modal";
import companyModal from "../models/company.modal";
import { Admin } from "../models/admin.modal";

export const getUserByIdAcrossCollections = async (userId: string) => {
  let user = await userModal.findById(userId);
  if (user) return user;

  user = await companyModal.findById(userId);
  if (user) return user;

  user = await Admin.findById(userId);
  if (user) return user;

  return null;
};

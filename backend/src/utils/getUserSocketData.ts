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
export const updateSocketInfo = async (
  userId: string,
  socketId: string | null
) => {
  const update = { socketId, online: !!socketId };

  const user = await userModal.findById(userId);
  if (user) return await userModal.findByIdAndUpdate(userId, update);

  const company = await companyModal.findById(userId);
  if (company) return await companyModal.findByIdAndUpdate(userId, update);

  const admin = await Admin.findById(userId);
  if (admin) return await Admin.findByIdAndUpdate(userId, update);

  return null;
};
export const updateSocketInfoBySocketId = async (socketId: string) => {
  const update = { socketId: null, online: false };

  const user = await userModal.findOne({ socketId });
  if (user) return await userModal.findByIdAndUpdate(user._id, update);

  const company = await companyModal.findOne({ socketId });
  if (company) return await companyModal.findByIdAndUpdate(company._id, update);

  const admin = await Admin.findOne({ socketId });
  if (admin) return await Admin.findByIdAndUpdate(admin._id, update);

  return null;
};

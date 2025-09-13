import { Admin } from "../repositories/models/admin.model";
import companyModel from "../repositories/models/company.model";
import userModel from "../repositories/models/user.model";

export const getUserByIdAcrossCollections = async (userId: string) => {
  let user = await userModel.findById(userId);
  if (user) return user;

  user = await companyModel.findById(userId);
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

  const user = await userModel.findById(userId);
  if (user) return await userModel.findByIdAndUpdate(userId, update);

  const company = await companyModel.findById(userId);
  if (company) return await companyModel.findByIdAndUpdate(userId, update);

  const admin = await Admin.findById(userId);
  if (admin) return await Admin.findByIdAndUpdate(userId, update);

  return null;
};
export const updateSocketInfoBySocketId = async (socketId: string) => {
  const update = { socketId: null, online: false };

  const user = await userModel.findOne({ socketId });
  if (user) return await userModel.findByIdAndUpdate(user._id, update);

  const company = await companyModel.findOne({ socketId });
  if (company) return await companyModel.findByIdAndUpdate(company._id, update);

  const admin = await Admin.findOne({ socketId });
  if (admin) return await Admin.findByIdAndUpdate(admin._id, update);

  return null;
};

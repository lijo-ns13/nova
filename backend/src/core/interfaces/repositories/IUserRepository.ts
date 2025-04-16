import { IUser } from "../../../infrastructure/database/models/user.modal";
export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  findByEmail(email: string, isPassword?: boolean): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  //   createUser(userData: Partial<IUser>): Promise<IUser>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  addToAppliedJobs(userId: string, jobId: string): Promise<void>;
  addToSavedJobs(userId: string, jobId: string): Promise<void>;
  removeFromSavedJobs(userId: string, jobId: string): Promise<void>;
  getSavedJobs(userId: string): Promise<any>;

  getAppliedJobs(userId: string): Promise<any>;
  findUsers(page: number, limit: number):any;
}

import { IUser } from "../../models/user.modal";

export interface IUserService {
  getUserData(userId: string): Promise<IUser | null>;
}

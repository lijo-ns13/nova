import { IUser } from "../../repositories/entities/user.entity";

export interface IUserService {
  getUserData(userId: string): Promise<IUser | null>;
}

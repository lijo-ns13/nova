import { IUser } from "../../repositories/entities/user.entity";

export interface IUserService {
  getUserById(
    userId: string
  ): Promise<{
    _id: string;
    name: string;
    profilePicture: string | null;
  } | null>;
  getUserData(userId: string): Promise<IUser | null>;
}

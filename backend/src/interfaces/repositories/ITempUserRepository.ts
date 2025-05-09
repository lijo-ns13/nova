import { IBaseRepository } from "./IBaseRepository";
import { ITempUser } from "../../models/user.temp.modal";

export interface ITempUserRepository extends IBaseRepository<ITempUser> {
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser>;
  findByEmail(email: string): Promise<ITempUser | null>;
}

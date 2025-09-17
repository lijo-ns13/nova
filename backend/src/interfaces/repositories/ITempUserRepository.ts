import { ITempUser } from "../../repositories/entities/tempuser.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ITempUserRepository extends IBaseRepository<ITempUser> {
  createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser>;
  findByEmail(email: string): Promise<ITempUser | null>;
}

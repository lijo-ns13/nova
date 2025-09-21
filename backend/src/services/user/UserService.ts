import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IUserService } from "../../interfaces/services/IUserService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../repositories/entities/user.entity";

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepo: IUserRepository
  ) {}
  async getUserData(userId: string): Promise<IUser | null> {
    return await this._userRepo.findById(userId);
  }
}

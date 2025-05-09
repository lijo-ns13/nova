// src/modules/job/services/JobService.ts

import { inject } from "inversify";

import { TYPES } from "../../di/types";

import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ICompany } from "../../models/company.modal";
import { ICompanyService } from "../../interfaces/services/ICompanyService";
import { IUserService } from "../../interfaces/services/IUserService";
import { IUser } from "../../models/user.modal";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepo: IUserRepository
  ) {}
  async getUserData(userId: string): Promise<IUser | null> {
    return await this._userRepo.findById(userId);
  }
}

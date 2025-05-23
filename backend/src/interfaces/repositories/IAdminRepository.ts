// src/core/interfaces/repositories/IAdminRepository.ts

import { IAdmin } from "../../models/admin.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}

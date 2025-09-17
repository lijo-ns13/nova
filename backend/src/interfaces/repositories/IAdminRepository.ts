import { IAdmin } from "../../repositories/entities/admin.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}

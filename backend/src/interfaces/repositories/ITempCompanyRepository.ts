import { ITempCompany } from "../../repositories/entities/temp.comany.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ITempCompanyRepository extends IBaseRepository<ITempCompany> {
  findByEmail(email: string): Promise<ITempCompany | null>;
}

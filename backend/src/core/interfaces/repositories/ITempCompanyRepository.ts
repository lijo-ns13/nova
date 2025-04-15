// src/core/interfaces/repositories/ITempCompanyRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { ITempCompany } from "../../../infrastructure/database/models/company.temp.modal";

export interface ITempCompanyRepository extends IBaseRepository<ITempCompany> {
  findByEmail(email: string): Promise<ITempCompany | null>;
}

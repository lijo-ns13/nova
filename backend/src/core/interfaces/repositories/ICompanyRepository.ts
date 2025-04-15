// src/core/interfaces/repositories/ICompanyRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { ICompany } from "../../../infrastructure/database/models/company.modal";

export interface ICompanyRepository extends IBaseRepository<ICompany> {
  findByEmail(email: string): Promise<ICompany | null>;
  findByGoogleId(googleId: string): Promise<ICompany | null>;
}

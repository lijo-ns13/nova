// src/interfaces/repositories/IInterviewRepository.ts
import { Document } from "mongoose";

import { IBaseRepository } from "./IBaseRepository";
import { IInterview } from "../../models/interview.modal";

export interface IInterviewRepository extends IBaseRepository<IInterview> {
  findByCompanyId(companyId: string): Promise<IInterview[]>;
  findByUserId(userId: string): Promise<IInterview[]>;
  findByApplicationId(applicationId: string): Promise<IInterview | null>;
  findByTimeSlot(
    companyId: string,
    scheduledAt: Date
  ): Promise<IInterview | null>;
}

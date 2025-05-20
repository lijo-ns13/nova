// src/interfaces/repositories/IApplicationRepository.ts
import { Document } from "mongoose";

import { IBaseRepository } from "./IBaseRepository";
import { IApplication } from "../../models/application.modal";

export interface IApplicationRepository extends IBaseRepository<IApplication> {
  updateStatus(
    applicationId: string,
    status: string
  ): Promise<IApplication | null>;
  findByJobId(jobId: string): Promise<IApplication[]>;
  findByUserId(userId: string): Promise<IApplication[]>;
  findByIdWithUserAndJob(applicationId: string): Promise<IApplication | null>;
  findByJobIdAndPop(userId: string): Promise<any>;
}

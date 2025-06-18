import { IApplication } from "../../models/application.modal";

export interface IUserInterviewService {
  updateStatus(
    applicationId: string,
    status: string,
    email?: string
  ): Promise<IApplication | null>;
  findInterview(applicationId: string, userId: string): Promise<any>;
}

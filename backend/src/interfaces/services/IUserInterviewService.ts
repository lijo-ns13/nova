import { IApplication } from "../../models/application.modal";

export interface IUserInterviewService {
  updateStatus(
    applicationId: string,
    status: string
  ): Promise<IApplication | null>;
}

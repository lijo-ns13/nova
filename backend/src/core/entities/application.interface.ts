import { ApplicationStatus } from "../../models/job.modal";

export interface IApplicationService {
  updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void>;
}

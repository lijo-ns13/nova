import { ApplicationStatus } from "../enums/applicationStatus";

export interface IApplicationService {
  updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void>;
}

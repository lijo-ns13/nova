import { ApplicationStatusResponseDTO } from "../../mapping/user/userapplication.mapper";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";

export interface IUserInterviewService {
  updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    email?: string
  ): Promise<ApplicationStatusResponseDTO>;
  findInterview(applicationId: string, userId: string): Promise<any>;

  getRescheduleProposedSlots(
    applicationId: string,
    userId: string
  ): Promise<Date[] | null>;
  handleRescheduleResponse(
    applicationId: string,
    status: ApplicationStatus,
    selectedSlot?: string,
    email?: string
  ): Promise<ApplicationStatusResponseDTO>;
}

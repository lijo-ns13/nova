// companyInterviewService.ts
import companyAxios from "../../../utils/companyAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/company/interviews`;

export interface Interview {
  id: string;
  roomId: string;
  scheduledAt: string;
  status: string;
  applicationId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  job: {
    id: string;
    title: string;
  };
}

export interface RescheduleProposal {
  applicationId: string;
  reason: string;
  timeSlots: string[]; // ISO date strings
}

class CompanyInterviewService {
  //   async scheduleInterview(
  //     userId: string,
  //     applicationId: string,
  //     scheduledAt: string
  //   ): Promise<Interview> {
  //     try {
  //       const response = await companyAxios.post(`${BASE_URL}`, {
  //         userId,
  //         applicationId,
  //         scheduledAt
  //       });
  //       return response.data.data;
  //     } catch (error) {
  //       console.error("Error scheduling interview:", error);
  //       throw error;
  //     }
  //   }

  //   async getUpcomingInterviews(): Promise<Interview[]> {
  //     try {
  //       const response = await companyAxios.get(`${BASE_URL}/upcoming`);
  //       return response.data.data;
  //     } catch (error) {
  //       console.error("Error fetching interviews:", error);
  //       throw error;
  //     }
  //   }

  async proposeReschedule(
    applicationId: string,
    reason: string,
    timeSlots: string[]
  ): Promise<Interview> {
    try {
      const response = await companyAxios.post(
        `${BASE_URL}/${applicationId}/reschedule`,
        { reason, timeSlots }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error proposing reschedule:", error);
      throw error;
    }
  }
}

export const companyInterviewService = new CompanyInterviewService();

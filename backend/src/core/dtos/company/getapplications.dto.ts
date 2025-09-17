import { z } from "zod";
import { ApplicationStatus } from "../../enums/applicationStatus";

export const getApplicationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
  userId: z.string().optional(),
  companyId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

export type GetApplicationsQuery = z.infer<typeof getApplicationsQuerySchema>;

export interface ApplicantRawData {
  _id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  user: {
    name: string;
    profilePicture?: string;
    email: string;
  };
}

export interface ApplicantSummaryDTO {
  applicationId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  name: string;
  profilePicture?: string;
  email: string;
}

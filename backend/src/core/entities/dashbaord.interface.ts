import { ApplicationStatus } from "../enums/applicationStatus";

export interface DashboardSummary {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  recentApplications: number;
  applicationChange: {
    weekly: number;
    monthly: number;
  };
}

export interface StatusDistribution {
  status: ApplicationStatus;
  count: number;
  percentage: number;
}

export interface DailyTrend {
  date: Date;
  total: number;
  statuses: Record<ApplicationStatus, number>;
}

export interface WeeklyTrend {
  weekStart: Date;
  total: number;
  statuses: Record<ApplicationStatus, number>;
}

export interface MonthlyTrend {
  monthStart: Date;
  total: number;
  statuses: Record<ApplicationStatus, number>;
}

export interface JobStatusTrend {
  year: number;
  month: number;
  status: string;
  count: number;
}

export interface Trends {
  daily: DailyTrend[];
  weekly: WeeklyTrend[];
  monthly: MonthlyTrend[];
  jobStatus: JobStatusTrend[];
}
export interface ApplicationStatusCount {
  _id: ApplicationStatus;
  count: number;
}

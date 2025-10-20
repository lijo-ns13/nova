// src/core/entities/aggregation.types.ts
import { ApplicationStatus } from "../enums/applicationStatus";

export interface RawDailyTrend {
  date: Date;
  count: number;
  statuses: ApplicationStatus[];
}

export interface RawWeeklyTrend {
  weekStart: Date;
  count: number;
  statuses: ApplicationStatus[];
}

export interface RawMonthlyTrend {
  monthStart: Date;
  count: number;
  statuses: ApplicationStatus[];
}

// src/modules/dashboard/controllers/companyDashboardController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import jobModal from "../../models/job.modal";
import applicationModal from "../../models/application.modal";
import { ApplicationStatus } from "../../models/application.modal";
interface Userr {
  _id: string;
  email: string;
  role: string;
}
export const getCompanyDashboardStats = async (req: Request, res: Response) => {
  try {
    // const companyId = (req.user as Userr)?._id;
    const companyId = "682570832310cdb03566e160";
    if (!companyId)
      return res.status(400).json({ message: "Company ID missing" });

    // Get all jobs created by this company
    const jobs = await jobModal
      .find({ company: companyId })
      .select("_id status");
    const jobIds = jobs.map((job) => job._id);

    // Get current date and calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    const [
      totalJobs,
      openJobs,
      closedJobs,
      totalApplications,
      recentApplications,
      statusCounts,
      dailyTrend,
      weeklyTrend,
      monthlyTrend,
      jobStatusTrend,
    ] = await Promise.all([
      // Job counts
      jobModal.countDocuments({ company: companyId }),
      jobModal.countDocuments({ company: companyId, status: "open" }),
      jobModal.countDocuments({ company: companyId, status: "closed" }),

      // Application counts
      applicationModal.countDocuments({ job: { $in: jobIds } }),
      applicationModal.countDocuments({
        job: { $in: jobIds },
        appliedAt: { $gte: oneWeekAgo },
      }),

      // Status counts with all possible statuses initialized
      applicationModal.aggregate([
        { $match: { job: { $in: jobIds } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Daily trends for last 7 days
      applicationModal.aggregate([
        {
          $match: {
            job: { $in: jobIds },
            appliedAt: { $gte: oneWeekAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$appliedAt" },
              month: { $month: "$appliedAt" },
              day: { $dayOfMonth: "$appliedAt" },
            },
            count: { $sum: 1 },
            statuses: {
              $push: "$status",
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
            statuses: 1,
            _id: 0,
          },
        },
      ]),

      // Weekly trends for last 12 weeks
      applicationModal.aggregate([
        {
          $match: {
            job: { $in: jobIds },
            appliedAt: { $gte: threeMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: "$appliedAt" },
              week: { $isoWeek: "$appliedAt" },
            },
            count: { $sum: 1 },
            statuses: {
              $push: "$status",
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.week": 1 },
        },
        {
          $project: {
            weekStart: {
              $dateFromParts: {
                isoWeekYear: "$_id.year",
                isoWeek: "$_id.week",
                isoDayOfWeek: 1,
              },
            },
            count: 1,
            statuses: 1,
            _id: 0,
          },
        },
        { $limit: 12 },
      ]),

      // Monthly trends for last 12 months
      applicationModal.aggregate([
        {
          $match: {
            job: { $in: jobIds },
            appliedAt: { $gte: oneYearAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$appliedAt" },
              month: { $month: "$appliedAt" },
            },
            count: { $sum: 1 },
            statuses: {
              $push: "$status",
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $project: {
            monthStart: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: 1,
              },
            },
            count: 1,
            statuses: 1,
            _id: 0,
          },
        },
        { $limit: 12 },
      ]),

      // Job status trend over time
      jobModal.aggregate([
        { $match: { company: companyId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    // Format status counts to include all possible statuses with zero values
    const formattedStatusCounts = Object.values(ApplicationStatus).map(
      (status) => {
        const found = statusCounts.find((s) => s._id === status);
        return {
          status,
          count: found ? found.count : 0,
          percentage:
            totalApplications > 0
              ? Math.round(
                  ((found ? found.count : 0) / totalApplications) * 100
                )
              : 0,
        };
      }
    );

    // Calculate percentage changes
    const weeklyPercentageChange = calculatePercentageChange(weeklyTrend);
    const monthlyPercentageChange = calculatePercentageChange(monthlyTrend);

    res.json({
      summary: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        recentApplications,
        applicationChange: {
          weekly: weeklyPercentageChange,
          monthly: monthlyPercentageChange,
        },
      },
      statusDistribution: formattedStatusCounts,
      trends: {
        daily: formatDailyTrend(dailyTrend),
        weekly: formatWeeklyTrend(weeklyTrend),
        monthly: formatMonthlyTrend(monthlyTrend),
        jobStatus: formatJobStatusTrend(jobStatusTrend),
      },
    });
  } catch (err) {
    console.error("Dashboard Error", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Helper functions for formatting data for charts
function calculatePercentageChange(data: any[]): number {
  if (data.length < 2) return 0;
  const recent = data[data.length - 1].count;
  const previous = data[data.length - 2].count;
  return previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;
}

function formatDailyTrend(data: any[]) {
  return data.map((day) => ({
    date: day.date,
    total: day.count,
    statuses: countStatuses(day.statuses),
  }));
}

function formatWeeklyTrend(data: any[]) {
  return data.map((week) => ({
    weekStart: week.weekStart,
    total: week.count,
    statuses: countStatuses(week.statuses),
  }));
}

function formatMonthlyTrend(data: any[]) {
  return data.map((month) => ({
    monthStart: month.monthStart,
    total: month.count,
    statuses: countStatuses(month.statuses),
  }));
}

function formatJobStatusTrend(data: any[]) {
  // Group by month and transform for stacked area chart
  // Implementation depends on your specific chart library needs
}

function countStatuses(statuses: string[]) {
  const counts: Record<string, number> = {};
  Object.values(ApplicationStatus).forEach((status) => {
    counts[status] = 0;
  });
  statuses.forEach((status) => {
    counts[status]++;
  });
  return counts;
}

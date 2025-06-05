// src/modules/analytics/controllers/adminAnalyticsController.ts
import { Request, Response } from "express";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  format,
  parseISO,
  eachDayOfInterval,
} from "date-fns";
import { Parser } from "json2csv";
import tranasctionModal from "../../../models/tranasction.modal";
import userModal from "../../../models/user.modal";
// Revenue stats with time range support
export const getRevenueStats = async (req: Request, res: Response) => {
  try {
    const { range, startDate, endDate } = req.query;
    let start, end;

    const now = new Date();

    if (range === "custom" && startDate && endDate) {
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default: // weekly by default
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const getRevenue = async (startDate: Date, endDate: Date) => {
      const result = await tranasctionModal.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]);
      return result[0]?.totalRevenue || 0;
    };

    const total = await getRevenue(start, end);

    res.json({
      [(range as string) || "weekly"]: total,
      daily:
        range === "daily"
          ? total
          : await getRevenue(startOfDay(now), endOfDay(now)),
      weekly:
        range === "weekly"
          ? total
          : await getRevenue(startOfWeek(now), endOfWeek(now)),
      monthly:
        range === "monthly"
          ? total
          : await getRevenue(startOfMonth(now), endOfMonth(now)),
      yearly:
        range === "yearly"
          ? total
          : await getRevenue(startOfYear(now), endOfYear(now)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch revenue stats." });
  }
};

// Top plans with time range support
export const getTopPlans = async (req: Request, res: Response) => {
  try {
    const { range, startDate, endDate } = req.query;
    let start, end;

    const now = new Date();

    if (range === "custom" && startDate && endDate) {
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default: // weekly by default
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const result = await tranasctionModal.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top plans." });
  }
};

// User growth analytics
export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    const { range, startDate, endDate } = req.query;
    let start, end;

    const now = new Date();

    if (range === "custom" && startDate && endDate) {
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
    } else {
      switch (range) {
        case "daily":
          start = subDays(startOfDay(now), 7);
          end = endOfDay(now);
          break;
        case "weekly":
          start = subDays(startOfWeek(now), 30);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = subDays(startOfMonth(now), 365);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = subDays(startOfYear(now), 365 * 3);
          end = endOfYear(now);
          break;
        default: // weekly by default
          start = subDays(startOfWeek(now), 30);
          end = endOfWeek(now);
      }
    }

    const days = eachDayOfInterval({ start, end });

    const result = await tranasctionModal.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing dates with 0
    const filledResult = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const found = result.find((item) => item._id === dateStr);
      return {
        date: dateStr,
        count: found ? found.count : 0,
      };
    });

    res.json(filledResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user growth data." });
  }
};

// User statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, activeUsers] = await Promise.all([
      userModal.countDocuments(),
      userModal.countDocuments({
        lastActive: { $gte: subDays(new Date(), 30) },
      }),
    ]);

    res.json({ totalUsers, activeUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user stats." });
  }
};

// Enhanced download report with time range support
export const downloadTransactionReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { range, startDate, endDate } = req.query;
    let start, end;

    const now = new Date();

    if (range === "custom" && startDate && endDate) {
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default: // weekly by default
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const transactions = await tranasctionModal
      .find({
        status: "completed",
        createdAt: { $gte: start, $lte: end },
      })
      .lean();

    const fields = [
      "_id",
      "userId",
      "amount",
      "currency",
      "status",
      "paymentMethod",
      "stripeSessionId",
      "planName",
      "createdAt",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment(
      `transaction_report_${range}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    return res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report." });
  }
};

// Full report in JSON format
export const getFullReport = async (req: Request, res: Response) => {
  try {
    const { range, startDate, endDate } = req.query;

    const [revenue, plans, growth, userStats] = await Promise.all([
      getRevenueStats(req, { json: (data: any) => data } as Response),
      getTopPlans(req, { json: (data: any) => data } as Response),
      getUserGrowth(req, { json: (data: any) => data } as Response),
      getUserStats(req, { json: (data: any) => data } as Response),
    ]);

    res.json({
      metadata: {
        generatedAt: new Date(),
        timeRange: range || "weekly",
        startDate,
        endDate,
      },
      revenue,
      topPlans: plans,
      userGrowth: growth,
      userStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate full report." });
  }
};
// Add to your controller
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { range, startDate, endDate } = req.query;
    let start, end;

    const now = new Date();

    if (range === "custom" && startDate && endDate) {
      start = parseISO(startDate as string);
      end = parseISO(endDate as string);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default: // weekly by default
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const transactions = await tranasctionModal
      .find({
        createdAt: { $gte: start, $lte: end },
      })
      .sort({ createdAt: -1 })
      .limit(100) // Limit to 100 most recent
      .lean();

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
};

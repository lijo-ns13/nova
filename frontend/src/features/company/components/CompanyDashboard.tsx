import React, { useEffect, useState } from "react";

import { format, subDays } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  DashboardStats,
  getCompanyDashboardStats,
} from "../services/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const CompanyDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { id } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("Company ID is missing");
          return;
        }
        const data = await getCompanyDashboardStats(id);
        console.log("data", data);
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  // Prepare data for charts
  const statusColors = {
    applied: "#3B82F6",
    shortlisted: "#10B981",
    rejected: "#EF4444",
    interview_scheduled: "#F59E0B",
    interview_cancelled: "#EF4444",
    interview_accepted_by_user: "#8B5CF6",
    interview_rejected_by_user: "#F97316",
    interview_reschedule_proposed: "#D97706",
    interview_reschedule_accepted: "#8B5CF6",
    interview_reschedule_rejected: "#EF4444",
    interview_completed: "#10B981",
    interview_passed: "#22C55E",
    interview_failed: "#DC2626",
    offered: "#EC4899",
    selected: "#6366F1",
    hired: "#059669",
    withdrawn: "#6B7280",
  };

  // Status distribution pie chart data
  const pieData = {
    labels: stats.statusDistribution.map((item) =>
      item.status.replace(/_/g, " ")
    ),
    datasets: [
      {
        data: stats.statusDistribution.map((item) => item.count),
        backgroundColor: stats.statusDistribution.map(
          (item) =>
            statusColors[item.status as keyof typeof statusColors] || "#9CA3AF"
        ),
        borderWidth: 1,
      },
    ],
  };

  // Application trend data
  const getTrendLabels = () => {
    if (timeRange === "daily") {
      return stats.trends.daily.map((item) => format(item.date, "MMM d"));
    } else if (timeRange === "weekly") {
      return stats.trends.weekly.map((item) => format(item.weekStart, "MMM d"));
    } else {
      return stats.trends.monthly.map((item) =>
        format(item.monthStart, "MMM yyyy")
      );
    }
  };

  const getTrendData = () => {
    if (timeRange === "daily") {
      return stats.trends.daily.map((item) => item.total);
    } else if (timeRange === "weekly") {
      return stats.trends.weekly.map((item) => item.total);
    } else {
      return stats.trends.monthly.map((item) => item.total);
    }
  };

  const lineData = {
    labels: getTrendLabels(),
    datasets: [
      {
        label: "Applications",
        data: getTrendData(),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Status trend data (stacked bar chart)
  const statusTrendData = {
    labels: getTrendLabels(),
    datasets: Object.keys(statusColors).map((status) => ({
      label: status.replace(/_/g, " "),
      data:
        timeRange === "daily"
          ? stats.trends.daily.map((item) => item.statuses[status] || 0)
          : timeRange === "weekly"
          ? stats.trends.weekly.map((item) => item.statuses[status] || 0)
          : stats.trends.monthly.map((item) => item.statuses[status] || 0),
      backgroundColor: statusColors[status as keyof typeof statusColors],
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Company Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Jobs</h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.summary.totalJobs}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-500">
              Open: {stats.summary.openJobs}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              Closed: {stats.summary.closedJobs}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">
            Total Applications
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.summary.totalApplications}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-500">
              Recent (7 days): {stats.summary.recentApplications}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Weekly Change</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">
              {stats.summary.applicationChange.weekly > 0 ? "+" : ""}
              {stats.summary.applicationChange.weekly}%
            </p>
            {stats.summary.applicationChange.weekly >= 0 ? (
              <svg
                className="w-6 h-6 text-green-500 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-red-500 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Monthly Change</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-gray-800">
              {stats.summary.applicationChange.monthly > 0 ? "+" : ""}
              {stats.summary.applicationChange.monthly}%
            </p>
            {stats.summary.applicationChange.monthly >= 0 ? (
              <svg
                className="w-6 h-6 text-green-500 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-red-500 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Application Status Distribution
          </h2>
          <div className="h-80">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = context.raw as number;
                        const total = context.dataset.data.reduce(
                          (a: number, b: number) => a + b,
                          0
                        );
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Application Trend Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Application Trends
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange("daily")}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === "daily"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === "weekly"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === "monthly"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-80">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Status Trend Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Application Status Trends
        </h2>
        <div className="h-96">
          <Bar
            data={statusTrendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

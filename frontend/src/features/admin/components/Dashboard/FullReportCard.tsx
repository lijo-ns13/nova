import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import { FullReport, getFullReport } from "../../services/DashboardService";
import LoadingSpinner from "../../../../components/LoadingSpinner";

type Range = "daily" | "weekly" | "monthly" | "yearly";

export const FullReportCard = () => {
  const [report, setReport] = useState<FullReport | null>(null);
  const [range, setRange] = useState<Range>("weekly");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getFullReport(range);
      console.log("data", data);
      setReport(data);
    } catch (err) {
      toast.error("Failed to fetch full report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [range]);

  if (loading) return <LoadingSpinner />;
  if (!report) return <p>No data available.</p>;

  const growthData = {
    labels: report.userGrowth.map((u) => u.month),
    datasets: [
      {
        label: "New Users",
        data: report.userGrowth.map((u) => u.newUsers),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Full Report</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className="border p-1 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="mb-4">
        <p>Total Revenue: ${report.revenue.weekly}</p>
        <p>Total Users: {report.userStats.totalUsers}</p>
        <p>Active Users: {report.userStats.activeUsers}</p>
      </div>

      <Line
        data={growthData}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  );
};

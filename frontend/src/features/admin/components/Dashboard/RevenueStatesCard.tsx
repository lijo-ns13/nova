import { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRevenueStats, RevenueStats } from "../../services/DashboardService";
import LoadingSpinner from "../../../../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Range = "daily" | "weekly" | "monthly" | "yearly";

export const RevenueStatsCard = () => {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [range, setRange] = useState<Range>("weekly");
  const [loading, setLoading] = useState(false);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const data = await getRevenueStats(range); // assuming service accepts range
      setRevenue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [range]);

  if (loading) return <LoadingSpinner />;
  if (!revenue) return <p>No revenue data available.</p>;

  const chartData = {
    labels: ["Daily", "Weekly", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [revenue.daily, revenue.weekly, revenue.monthly, revenue.yearly],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Revenue Stats</h2>
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

      <Bar
        data={chartData}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  );
};

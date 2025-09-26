import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getUserGrowth, UserGrowthDTO } from "../../services/DashboardService";
import LoadingSpinner from "../../../../components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Range = "daily" | "weekly" | "monthly" | "yearly";

export const UserGrowthChart = () => {
  const [growth, setGrowth] = useState<UserGrowthDTO[]>([]);
  const [range, setRange] = useState<Range>("weekly");
  const [loading, setLoading] = useState(false);

  const fetchGrowth = async () => {
    try {
      setLoading(true);
      const data = await getUserGrowth(range);
      setGrowth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowth();
  }, [range]);

  if (loading) return <LoadingSpinner />;
  if (!growth.length) return <p>No data available.</p>;

  const chartData = {
    labels: growth.map((g) => g.month),
    datasets: [
      {
        label: "New Users",
        data: growth.map((g) => g.newUsers),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Growth</h2>
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
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "New Users Over Time" },
          },
        }}
      />
    </div>
  );
};

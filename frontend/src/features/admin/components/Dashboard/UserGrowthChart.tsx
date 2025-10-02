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
      console.log("usergrowth", data);
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

  // ✅ Use correct fields: date + count
  const chartData = {
    labels: growth.map((g) =>
      new Date(g.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "New Users",
        data: growth.map((g) => g.count),
        borderColor: "rgba(59, 130, 246, 1)", // Tailwind blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: { display: true, text: "New Users Over Time" },
      tooltip: { mode: "index" as const, intersect: false },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
      y: { beginAtZero: true, precision: 0 },
    },
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Growth</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
          className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

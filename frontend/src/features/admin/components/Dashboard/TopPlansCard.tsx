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
import { getTopPlans, TopPlan } from "../../services/DashboardService";
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

export const TopPlansCard = () => {
  const [topPlans, setTopPlans] = useState<TopPlan[]>([]);
  const [range, setRange] = useState<Range>("weekly");
  const [loading, setLoading] = useState(false);

  const fetchTopPlans = async () => {
    try {
      setLoading(true);
      const data = await getTopPlans(range);
      setTopPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopPlans();
  }, [range]);

  if (loading) return <LoadingSpinner />;
  if (!topPlans.length) return <p>No top plans available.</p>;

  const chartData = {
    labels: topPlans.map((plan) => plan.name),
    datasets: [
      {
        label: "Subscribers",
        data: topPlans.map((plan) => plan.subscribers),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top Plans</h2>
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
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Subscribers per Plan" },
          },
        }}
      />
    </div>
  );
};

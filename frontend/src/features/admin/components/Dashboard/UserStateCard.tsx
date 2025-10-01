import { useEffect, useState } from "react";
import { getUserStats, UserStats } from "../../services/DashboardService";
import LoadingSpinner from "../../../../components/LoadingSpinner";

export const UserStatsCard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getUserStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <p>No data available.</p>;

  return (
    <div className="p-4 border rounded shadow-sm bg-white grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-semibold">Total Users</p>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      {/* <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-semibold">Active Users</p>
        <p className="text-2xl font-bold">{stats.activeUsers}</p>
      </div> */}
    </div>
  );
};

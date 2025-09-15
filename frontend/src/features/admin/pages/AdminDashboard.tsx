import { useEffect, useState } from "react";
import {
  getRevenueStats,
  getTopPlans,
  getUserGrowth,
  getUserStats,
  getTransactions,
  downloadTransactionReport,
  RevenueStats,
  TopPlan,
  UserGrowthDTO,
  UserStats,
  Transaction,
} from "../services/DashboardService";

import { TopPlansCard } from "../components/Dashboard/TopPlansCard";
import { UserGrowthChart } from "../components/Dashboard/UserGrowthChart";

import { FullReportCard } from "../components/Dashboard/FullReportCard";

import toast from "react-hot-toast";
import { RevenueStatsCard } from "../components/Dashboard/RevenueStatesCard";
import { UserStatsCard } from "../components/Dashboard/UserStateCard";
import { TransactionsTable } from "../components/Dashboard/TransactionTable";

const AdminDashboard = () => {
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [topPlans, setTopPlans] = useState<TopPlan[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthDTO[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rev, plans, growth, stats, trans] = await Promise.all([
        getRevenueStats(),
        getTopPlans(),
        getUserGrowth(),
        getUserStats(),
        getTransactions(),
      ]);
      setRevenue(rev);
      setTopPlans(plans);
      setUserGrowth(growth);
      setUserStats(stats);
      setTransactions(trans);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      await downloadTransactionReport("monthly");
      toast.success("Transaction report downloaded");
    } catch (err) {
      toast.error("Failed to download report");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Revenue + User Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueStatsCard />
        <UserStatsCard />
      </div>

      {/* Top Plans + User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPlansCard />
        <UserGrowthChart />
      </div>

      {/* Full Report Card */}
      <FullReportCard />

      {/* Transactions Table + Download */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <button
            onClick={handleDownloadReport}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Download CSV
          </button>
        </div>
        <TransactionsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;

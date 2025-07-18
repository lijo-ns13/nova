// src/pages/AdminDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  Button,
  Card,
  Spin,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Divider,
  Table,
  Typography,
} from "antd";
import {
  DownloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API_BASE_URL}`;
import novalogo from "../../../assets/novalogo.png";
const { Title: AntTitle, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

interface RevenueStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  [key: string]: number;
}

interface TopPlan {
  _id: string;
  count: number;
  totalRevenue: number;
}

interface UserGrowth {
  date: string;
  count: number;
}
interface UserT {
  _id: string;
  name: string;
}
interface Transaction {
  _id: string;
  userId: UserT;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  planName: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [revenue, setRevenue] = useState<RevenueStats>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [topPlans, setTopPlans] = useState<TopPlan[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>("weekly");
  const [customRange, setCustomRange] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    fetchStats();
    fetchUserStats();
  }, [timeRange, customRange]);
  const getTimeSpanText = () => {
    if (timeRange === "custom" && customRange.length === 2) {
      return `Custom Range: ${customRange[0]} to ${customRange[1]}`;
    }

    const now = new Date();
    switch (timeRange) {
      case "daily":
        return `Daily: ${now.toLocaleDateString()}`;
      case "weekly":
        // Calculate start of week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return `Weekly: ${startOfWeek.toLocaleDateString()} to ${now.toLocaleDateString()}`;
      case "monthly":
        return `Monthly: ${new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ).toLocaleDateString()} to ${now.toLocaleDateString()}`;
      case "yearly":
        return `Yearly: ${new Date(
          now.getFullYear(),
          0,
          1
        ).toLocaleDateString()} to ${now.toLocaleDateString()}`;
      default:
        return "Time Range: N/A";
    }
  };
  const fetchStats = async () => {
    try {
      setLoading(true);
      const rangeParams =
        timeRange === "custom" && customRange.length === 2
          ? { startDate: customRange[0], endDate: customRange[1] }
          : { range: timeRange };

      const [revRes, planRes, growthRes, txnRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/analytics/revenue-stats`, {
          params: rangeParams,
        }),
        axios.get(`${BASE_URL}/api/admin/analytics/top-plans`, {
          params: rangeParams,
        }),
        axios.get(`${BASE_URL}/api/admin/analytics/user-growth`, {
          params: rangeParams,
        }),
        axios.get(`${BASE_URL}/api/admin/analytics/transactions`, {
          params: rangeParams,
        }),
      ]);

      setRevenue(revRes.data);
      setTopPlans(planRes.data);
      setUserGrowth(growthRes.data);
      setTransactions(txnRes.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/analytics/user-stats`);
      setTotalUsers(res.data.totalUsers);
      setActiveUsers(res.data.activeUsers);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const handleCustomRangeChange = (dates: any, dateStrings: string[]) => {
    if (dates) {
      setCustomRange(dateStrings);
      setTimeRange("custom");
    }
  };

  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "User",
      dataIndex: ["userId", "name"],
      key: "userName",
    },
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount.toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`capitalize ${
            status === "completed"
              ? "text-green-500"
              : status === "failed"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const { jsPDF } = await import("jspdf");
      const autoTable = await import("jspdf-autotable");

      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add logo (top right)
      const logoWidth = 30;
      const logoHeight = 15;
      doc.addImage(
        novalogo,
        "PNG",
        pageWidth - margin - logoWidth,
        margin,
        logoWidth,
        logoHeight
      );

      // Add title (top left)
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("Transaction Report", margin, margin + 15);

      // Add time period (below title)
      doc.setFontSize(12);
      const timePeriodText = getTimeSpanText();
      doc.text(timePeriodText, margin, margin + 25);

      // Add financial summary (below time period)
      doc.setFontSize(14);
      doc.text(
        `Total Revenue: ₹${revenue[timeRange]?.toFixed(2) || "0.00"}`,
        margin,
        margin + 40
      );
      doc.text(
        `Total Transactions: ${transactions.length}`,
        margin,
        margin + 50
      );

      // Prepare transaction data
      const transactionData = transactions.map((txn) => [
        new Date(txn.createdAt).toLocaleString(),
        txn.userId?.name || "N/A",
        txn.planName,
        `₹${txn.amount.toFixed(2)}`,
        txn.paymentMethod,
        txn.status.charAt(0).toUpperCase() + txn.status.slice(1), // Capitalize status
      ]);

      // Add transactions table (below summary)
      autoTable.default(doc, {
        startY: margin + 60,
        head: [["Date", "User", "Plan", "Amount", "Method", "Status"]],
        body: transactionData,
        styles: {
          cellPadding: 3,
          fontSize: 9,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue header
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Date
          1: { cellWidth: 25 }, // User
          2: { cellWidth: 25 }, // Plan
          3: { cellWidth: 20 }, // Amount
          4: { cellWidth: 20 }, // Method
          5: { cellWidth: 20 }, // Status
        },
        margin: { left: margin },
      });

      // Save PDF with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-");
      doc.save(`Transactions_${timeRange}_${timestamp}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  const revenueChartData = {
    labels: ["Daily", "Weekly", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Revenue (INR)",
        data: [revenue.daily, revenue.weekly, revenue.monthly, revenue.yearly],
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const planPieData = {
    labels: topPlans.map((p) => p._id),
    datasets: [
      {
        label: "Subscriptions",
        data: topPlans.map((p) => p.count),
        backgroundColor: [
          "#6366f1",
          "#10b981",
          "#f97316",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f43f5e",
          "#84cc16",
          "#0ea5e9",
          "#d946ef",
        ],
      },
    ],
  };

  const revenueTrendData = {
    labels: userGrowth.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Revenue Trend",
        data: userGrowth.map((item) => item.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const planRevenueData = {
    labels: topPlans.map((p) => p._id),
    datasets: [
      {
        label: "Revenue by Plan",
        data: topPlans.map((p) => p.totalRevenue),
        backgroundColor: [
          "#6366f1",
          "#10b981",
          "#f97316",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f43f5e",
          "#84cc16",
          "#0ea5e9",
          "#d946ef",
        ],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6 " id="dashboard-content" ref={dashboardRef}>
      <div className="flex justify-between items-center">
        <AntTitle level={2} className="mb-0">
          Admin Dashboard
        </AntTitle>
        <div className="flex space-x-4">
          <Select
            value={timeRange}
            style={{ width: 120 }}
            onChange={handleTimeRangeChange}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
            <Option value="custom">Custom Range</Option>
          </Select>

          {timeRange === "custom" && (
            <RangePicker
              onChange={handleCustomRangeChange}
              style={{ width: 250 }}
            />
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={revenue[timeRange] || 0}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="INR"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={activeUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Top Plan"
                  value={topPlans[0]?._id || "N/A"}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Charts Section */}
          <Row gutter={16} className="mb-6">
            <Col span={12}>
              <Card title="Revenue Overview">
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top Purchased Plans">
                <Pie
                  data={planPieData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-6">
            <Col span={12}>
              <Card title="Revenue Trend">
                <Line
                  data={revenueTrendData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Revenue by Plan">
                <Bar
                  data={planRevenueData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Transaction History */}
          {/* <Card
            title={`Transaction History (${timeRange}${
              timeRange === "custom" ? `: ${customRange.join(" to ")}` : ""
            })`}
            className="mb-6"
          >
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              rowKey="_id"
            />
          </Card> */}

          {/* Export Section */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadPDF}
              loading={loading}
            >
              Export as PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

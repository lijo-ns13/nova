// src/pages/AdminDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  message,
} from "antd";
import {
  DownloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

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

interface Transaction {
  _id: string;
  userId: string;
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
        axios.get("http://localhost:3000/api/admin/analytics/revenue-stats", {
          params: rangeParams,
        }),
        axios.get("http://localhost:3000/api/admin/analytics/top-plans", {
          params: rangeParams,
        }),
        axios.get("http://localhost:3000/api/admin/analytics/user-growth", {
          params: rangeParams,
        }),
        axios.get("http://localhost:3000/api/admin/analytics/transactions", {
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
      const res = await axios.get(
        "http://localhost:3000/api/admin/analytics/user-stats"
      );
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
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
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
    // Create a temporary loading message
    const hideMessage = message.loading("Generating PDF report...", 0);

    try {
      // 1. Prepare the content
      const dashboardElement = dashboardRef.current;
      if (!dashboardElement) {
        message.error("Dashboard content not found");
        return;
      }

      // 2. Force all charts to render completely
      window.dispatchEvent(new Event("resize"));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Create a clone of the dashboard
      const clone = dashboardElement.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.width = `${dashboardElement.offsetWidth}px`;
      document.body.appendChild(clone);

      // 4. Remove any loading elements from the clone
      const loadingElements = clone.querySelectorAll(
        ".ant-spin, .ant-spin-blur"
      );
      loadingElements.forEach((el) => el.remove());

      // 5. Prepare canvas options
      const canvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // Ensure everything is visible
          const elements = clonedDoc.querySelectorAll("*");
          elements.forEach((el) => {
            const element = el as HTMLElement;
            element.style.visibility = "visible";
            element.style.opacity = "1";
          });
        },
      };

      // 6. Generate the canvas
      const canvas = await html2canvas(clone, canvasOptions);
      document.body.removeChild(clone);

      // 7. Create PDF
      const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);

      // Add logo (if you have it imported as novalogo)
      if (novalogo) {
        const logoWidth = 50;
        const logoHeight = 50;
        pdf.addImage(novalogo, "PNG", 20, 20, logoWidth, logoHeight);
      }

      // Add header information
      pdf.setFontSize(16);
      pdf.setTextColor(40);
      pdf.setFont("helvetica", "bold");
      pdf.text("Dashboard Analytics Report", novalogo ? 80 : 20, 40);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Time Period: ${getTimeSpanText()}`, 20, 60);
      pdf.text(`Total Revenue: ₹${revenue[timeRange] || 0}`, 20, 80);
      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        canvas.width - 20,
        40,
        {
          align: "right",
        }
      );

      // Add the dashboard content
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        100, // Start below the header
        canvas.width,
        canvas.height - 100 // Adjust height for header
      );

      // 8. Save the PDF
      pdf.save(
        `dashboard_report_${timeRange}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      message.error("Failed to generate PDF");
    } finally {
      hideMessage();
    }
  };

  const getBase64Image = (img: HTMLImageElement): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve("");
      }
    });
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/analytics/download-report",
        {
          responseType: "blob",
          params: {
            range: timeRange,
            ...(timeRange === "custom" &&
              customRange.length === 2 && {
                startDate: customRange[0],
                endDate: customRange[1],
              }),
          },
        }
      );

      saveAs(
        response.data,
        `report_${new Date().toISOString().slice(0, 10)}.csv`
      );
    } catch (error) {
      console.error("Error downloading CSV report:", error);
    }
  };

  const downloadJSON = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/analytics/full-report",
        {
          params: {
            range: timeRange,
            ...(timeRange === "custom" &&
              customRange.length === 2 && {
                startDate: customRange[0],
                endDate: customRange[1],
              }),
          },
        }
      );

      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      saveAs(blob, `report_${new Date().toISOString().slice(0, 10)}.json`);
    } catch (error) {
      console.error("Error downloading JSON report:", error);
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
          <Card
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
          </Card>

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
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={downloadCSV}
              loading={loading}
            >
              Export as CSV
            </Button>
            <Button
              type="dashed"
              icon={<DownloadOutlined />}
              onClick={downloadJSON}
              loading={loading}
            >
              Export as JSON
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

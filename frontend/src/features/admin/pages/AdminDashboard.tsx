import React, { useState, useEffect } from "react";
import {
  // Bar,
  // Line,
  // Pie,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios, { AxiosResponse } from "axios";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Button,
  DatePicker,
  Space,
  Table,
  Tag,
  Dropdown,
  Menu,
  Spin,
  message,
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import moment from "moment";
import { Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Type definitions
type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";
type SubscriptionPlan = "BASIC" | "PRO" | "PREMIUM";
type DownloadFormat = "csv" | "excel" | "json";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalCompanies: number;
  verifiedCompanies: number;
  pendingCompanies: number;
  totalTransactions: number;
  transactionRevenue: number;
  subscriptionDistribution: Record<SubscriptionPlan, number>;
}

interface SubscriptionAnalytics {
  total: number;
  data: Array<{
    date: string;
    BASIC: number;
    PRO: number;
    PREMIUM: number;
    total: number;
  }>;
  chartData: ChartData;
}

interface TransactionReport {
  total: number;
  totalAmount: number;
  data: Transaction[];
  chartData: ChartData;
}

interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  planName: SubscriptionPlan;
  createdAt: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
  }>;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionAnalytics | null>(null);
  const [transactionData, setTransactionData] =
    useState<TransactionReport | null>(null);
  const [loading, setLoading] = useState({
    stats: false,
    subscription: false,
    transactions: false,
  });
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [planFilter, setPlanFilter] = useState<SubscriptionPlan | "all">("all");
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setLoading((prev) => ({ ...prev, stats: true }));
    try {
      const response: AxiosResponse<DashboardStats> = await axios.get(
        "/api/admin/dashboard/stats"
      );
      setStats(response.data);
    } catch (error) {
      message.error("Failed to fetch dashboard statistics");
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  // Fetch subscription analytics
  const fetchSubscriptionAnalytics = async (period: TimePeriod) => {
    setLoading((prev) => ({ ...prev, subscription: true }));
    try {
      const response: AxiosResponse<SubscriptionAnalytics> = await axios.get(
        "/api/admin/dashboard/subscription-analytics",
        { params: { period } }
      );
      setSubscriptionData(response.data);
    } catch (error) {
      message.error("Failed to fetch subscription analytics");
      console.error("Error fetching subscription analytics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, subscription: false }));
    }
  };

  // Fetch transaction reports
  const fetchTransactionReports = async (
    period: TimePeriod,
    planName?: SubscriptionPlan,
    customRange?: [moment.Moment, moment.Moment]
  ) => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      const params: any = { period };
      if (planName && planName !== "all") params.planName = planName;
      if (customRange) {
        params.startDate = customRange[0].toISOString();
        params.endDate = customRange[1].toISOString();
      }

      const response: AxiosResponse<TransactionReport> = await axios.get(
        "/api/admin/dashboard/transaction-reports",
        { params }
      );
      setTransactionData(response.data);
    } catch (error) {
      message.error("Failed to fetch transaction reports");
      console.error("Error fetching transaction reports:", error);
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  // Handle download
  const handleDownload = async (format: DownloadFormat) => {
    try {
      const params: any = { period, format };
      if (planFilter && planFilter !== "all") params.planName = planFilter;
      if (dateRange) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }

      const response = await axios.get(
        "/api/admin/dashboard/download-transactions",
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transactions-${moment().format("YYYYMMDD-HHmmss")}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Download started");
    } catch (error) {
      message.error("Failed to download report");
      console.error("Error downloading report:", error);
    }
  };

  // Refresh all data
  const refreshAll = () => {
    fetchDashboardStats();
    fetchSubscriptionAnalytics(period);
    fetchTransactionReports(
      period,
      planFilter !== "all" ? planFilter : undefined,
      dateRange || undefined
    );
  };

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  // Effect for period change
  useEffect(() => {
    fetchSubscriptionAnalytics(period);
    fetchTransactionReports(
      period,
      planFilter !== "all" ? planFilter : undefined,
      dateRange || undefined
    );
  }, [period, planFilter, dateRange]);

  // Download menu items
  const downloadMenuItems: MenuProps["items"] = [
    {
      key: "csv",
      label: "CSV",
      icon: <FileTextOutlined />,
      onClick: () => handleDownload("csv"),
    },
    {
      key: "excel",
      label: "Excel",
      icon: <FileExcelOutlined />,
      onClick: () => handleDownload("excel"),
    },
    {
      key: "json",
      label: "JSON",
      icon: <FileDoneOutlined />,
      onClick: () => handleDownload("json"),
    },
  ];

  // Transaction columns for table
  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => (
        <span className="text-xs font-mono">{id.slice(-8)}</span>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (id: string) => (
        <span className="text-xs font-mono">{id.slice(-8)}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: Transaction) => (
        <span>
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: record.currency || "INR",
          }).format(amount)}
        </span>
      ),
    },
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
      render: (plan: SubscriptionPlan) => (
        <Tag
          color={plan === "BASIC" ? "blue" : plan === "PRO" ? "green" : "cyan"}
        >
          {plan}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "completed"
              ? "success"
              : status === "pending"
              ? "warning"
              : "error"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("DD MMM YYYY HH:mm"),
    },
  ];

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={refreshAll}
          loading={
            loading.stats || loading.subscription || loading.transactions
          }
        >
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <Spin spinning={loading.stats}>
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats?.totalUsers || 0}
                loading={loading.stats}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Companies"
                value={stats?.totalCompanies || 0}
                loading={loading.stats}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={stats?.totalTransactions || 0}
                loading={loading.stats}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats?.transactionRevenue || 0}
                precision={2}
                prefix="₹"
                loading={loading.stats}
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Subscription Analytics */}
      <Spin spinning={loading.subscription}>
        <Card
          title="Subscription Analytics"
          className="mb-6"
          extra={
            <Select
              defaultValue="weekly"
              value={period}
              onChange={(value: TimePeriod) => setPeriod(value)}
              style={{ width: 120 }}
            >
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          }
        >
          {subscriptionData && (
            <>
              <Bar
                data={subscriptionData.chartData}
                options={chartOptions}
                height={100}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Subscription Distribution
                </h3>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="Basic"
                        value={stats?.subscriptionDistribution.BASIC || 0}
                        prefix={
                          <div className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-2"></div>
                        }
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="Pro"
                        value={stats?.subscriptionDistribution.PRO || 0}
                        prefix={
                          <div className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></div>
                        }
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="Premium"
                        value={stats?.subscriptionDistribution.PREMIUM || 0}
                        prefix={
                          <div className="w-3 h-3 rounded-full bg-cyan-500 inline-block mr-2"></div>
                        }
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Card>
      </Spin>

      {/* Transaction Reports */}
      <Spin spinning={loading.transactions}>
        <Card
          title="Transaction Reports"
          extra={
            <Space>
              <Select
                value={planFilter}
                onChange={(value: SubscriptionPlan | "all") =>
                  setPlanFilter(value)
                }
                style={{ width: 120 }}
                allowClear
              >
                <Option value="all">All Plans</Option>
                <Option value="BASIC">Basic</Option>
                <Option value="PRO">Pro</Option>
                <Option value="PREMIUM">Premium</Option>
              </Select>

              <RangePicker
                onChange={(dates) =>
                  setDateRange(dates as [moment.Moment, moment.Moment])
                }
                value={dateRange}
                disabledDate={(current) =>
                  current && current > moment().endOf("day")
                }
              />

              <Dropdown
                menu={{ items: downloadMenuItems }}
                placement="bottomRight"
              >
                <Button type="primary" icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
            </Space>
          }
        >
          {transactionData && (
            <>
              <Line
                data={transactionData.chartData}
                options={chartOptions}
                height={100}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Transactions
                </h3>
                <Table
                  columns={transactionColumns}
                  dataSource={transactionData.data}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: true }}
                  size="small"
                />
              </div>
            </>
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default AdminDashboard;

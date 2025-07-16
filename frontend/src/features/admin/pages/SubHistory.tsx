import { useEffect, useState } from "react";
import {
  GetFilteredTransactions,
  TransactionFilterInput,
  TransactionResponseDTO,
  TransactionStatus,
} from "../services/SubscriptionService";

// Constants
const TRANSACTION_STATUSES: TransactionStatus[] = [
  "pending",
  "completed",
  "failed",
  "refunded",
];
const PLAN_TYPES = ["BASIC", "PRO", "PREMIUM"] as const;

function SubHistory() {
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Partial<TransactionFilterInput>>({});

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const result = await GetFilteredTransactions({
        ...filters,
        page: page.toString(),
        limit: limit.toString(),
      });
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, page]);

  const handleFilterChange = (
    field: keyof TransactionFilterInput,
    value: string
  ) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2>Subscription History</h2>

      {/* Filters */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Status Filter */}
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {TRANSACTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Plan Name Filter */}
        <select
          value={filters.planName || ""}
          onChange={(e) => handleFilterChange("planName", e.target.value)}
        >
          <option value="">All Plans</option>
          {PLAN_TYPES.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>

        {/* Active Users Filter */}
        <select
          value={filters.isActiveOnly ?? ""}
          onChange={(e) => handleFilterChange("isActiveOnly", e.target.value)}
        >
          <option value="">All Users</option>
          <option value="true">Active Only</option>
        </select>

        {/* From Date */}
        <input
          type="date"
          value={filters.from?.split("T")[0] || ""}
          onChange={(e) =>
            handleFilterChange(
              "from",
              e.target.value ? new Date(e.target.value).toISOString() : ""
            )
          }
        />

        {/* To Date */}
        <input
          type="date"
          value={filters.to?.split("T")[0] || ""}
          onChange={(e) =>
            handleFilterChange(
              "to",
              e.target.value ? new Date(e.target.value).toISOString() : ""
            )
          }
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <p>
            Showing {transactions.length} of {total} transactions
          </p>

          <table
            border={1}
            cellPadding={6}
            cellSpacing={0}
            style={{ width: "100%", textAlign: "left" }}
          >
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th>Refund Reason</th>
                <th>Refund Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.user.name}</td>
                  <td>{txn.user.email}</td>
                  <td>{txn.planName}</td>
                  <td>
                    ₹{txn.amount} {txn.currency.toUpperCase()}
                  </td>
                  <td>{txn.status}</td>
                  <td>{txn.paymentMethod}</td>
                  <td>
                    {txn.status === "refunded" ? txn.refundReason ?? "-" : "-"}
                  </td>
                  <td>
                    {txn.status === "refunded" && txn.refundDate
                      ? new Date(txn.refundDate).toLocaleString()
                      : "-"}
                  </td>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {total > limit && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
                gap: "1rem",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ⬅️ Prev
              </button>
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubHistory;

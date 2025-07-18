import { useEffect, useState } from "react";
import {
  GetFilteredTransactions,
  TransactionFilterInput,
  TransactionResponseDTO,
  TransactionStatus,
} from "../services/SubscriptionService";

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
  const [limit] = useState(3);
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Subscription History
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          {TRANSACTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.planName || ""}
          onChange={(e) => handleFilterChange("planName", e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Plans</option>
          {PLAN_TYPES.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>

        <select
          value={filters.isActiveOnly ?? ""}
          onChange={(e) => handleFilterChange("isActiveOnly", e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Users</option>
          <option value="true">Active Only</option>
        </select>

        <input
          type="date"
          value={filters.from?.split("T")[0] || ""}
          onChange={(e) =>
            handleFilterChange(
              "from",
              e.target.value ? new Date(e.target.value).toISOString() : ""
            )
          }
          className="border px-3 py-2 rounded-md text-sm"
        />

        <input
          type="date"
          value={filters.to?.split("T")[0] || ""}
          onChange={(e) =>
            handleFilterChange(
              "to",
              e.target.value ? new Date(e.target.value).toISOString() : ""
            )
          }
          className="border px-3 py-2 rounded-md text-sm"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500">No transactions found.</div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-600">
            Showing {transactions.length} of {total} transactions
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Refund Reason</th>
                  <th className="p-3 text-left">Refund Date</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {transactions.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3">{txn.user.name}</td>
                    <td className="p-3">{txn.user.email}</td>
                    <td className="p-3">{txn.planName}</td>
                    <td className="p-3">
                      ₹{txn.amount} {txn.currency.toUpperCase()}
                    </td>
                    <td className="p-3 capitalize">{txn.status}</td>
                    <td className="p-3">{txn.paymentMethod}</td>
                    <td className="p-3">
                      {txn.status === "refunded"
                        ? txn.refundReason ?? "-"
                        : "-"}
                    </td>
                    <td className="p-3">
                      {txn.status === "refunded" && txn.refundDate
                        ? new Date(txn.refundDate).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-center mt-6 gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              <span className="text-sm text-gray-700">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubHistory;

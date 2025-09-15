import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { getTransactions, Transaction } from "../../services/DashboardService";

type Range = "daily" | "weekly" | "monthly" | "yearly";

export const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [range, setRange] = useState<Range>("weekly");
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions(range);
      setTransactions(data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [range]);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Plan</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Payment Method</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 border">{t.user}</td>
                  <td className="px-4 py-2 border">{t.plan}</td>
                  <td className="px-4 py-2 border">
                    {t.amount} {t.currency}
                  </td>
                  <td className="px-4 py-2 border">{t.status}</td>
                  <td className="px-4 py-2 border">{t.paymentMethod}</td>
                  <td className="px-4 py-2 border">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

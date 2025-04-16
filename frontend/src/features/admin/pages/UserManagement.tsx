import React, { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/userServices";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    usersPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const data = await getUsers(page, limit);
      setUsers(data.data.users);
      setPagination(data.data.pagination);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleBlock = async (userId: string) => {
    try {
      let isOk = confirm("are you want to delete");
      if (isOk) {
        await blockUser(userId);
      }

      fetchUsers(page);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Error blocking user");
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await unblockUser(userId);
      fetchUsers(page);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Error unblocking user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {user.isBlocked ? (
                      <span className="text-red-500 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {user.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              disabled={page === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;

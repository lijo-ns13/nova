import React, { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/userServices";
import { debounce } from "lodash";
import { Pagination, User } from "../types/userTypes";
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<Pagination>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    usersPerPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced fetch function
  const debouncedFetchUsers = debounce(
    async (query: string, pageNum: number) => {
      try {
        setLoading(true);
        const data = await getUsers(pageNum, limit, query);
        setUsers(data.data.users);
        setPagination(data.data.pagination);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        console.error("Error fetching users:", err);
        setError(apiError.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    500
  );

  // Fetch users with current search and page
  const fetchUsers = (pageNum: number, query: string = searchQuery) => {
    setPage(pageNum);
    debouncedFetchUsers(query, pageNum);
  };

  // Initial load and when search/page changes
  useEffect(() => {
    fetchUsers(page, searchQuery);
  }, [page, searchQuery]);

  const handleBlock = async (userId: string) => {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this user?"
    );
    if (confirmBlock) {
      try {
        await blockUser(userId);
        fetchUsers(page); // Refresh current view
      } catch (err) {
        const apiError = err as ApiError;
        console.error("Error blocking user:", err);
        setError(apiError.response?.data?.message || "Failed to block user");
      }
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await unblockUser(userId);
      fetchUsers(page); // Refresh current view
    } catch (err) {
      const apiError = err as ApiError;
      console.error("Error unblocking user:", err);
      setError(apiError.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          User Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {user.profilePicture && (
                              <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            )}
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(user._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "No users found matching your search"
                          : "No users available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, pagination.totalUsers)} of{" "}
                  {pagination.totalUsers} users
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 border rounded-md ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-md ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                    className={`px-4 py-2 border rounded-md ${
                      page === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { getUsers, blockUser, unblockUser } from "../../services/userServices";
import { Pagination as PaginationType, User } from "../../types/adminUsertypes";

// Component imports
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import UserTable from "./UserTable";
import UserCard from "./UserCard";
import LoadingIndicator from "./LoadingIndicator";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationType>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    usersPerPage: 10,
  });
  const [loading, setLoading] = useState(true);
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
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to fetch users");
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
      } catch (err: any) {
        console.error("Error blocking user:", err);
        setError(err.response?.data?.message || "Failed to block user");
      }
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await unblockUser(userId);
      fetchUsers(page); // Refresh current view
    } catch (err: any) {
      console.error("Error unblocking user:", err);
      setError(err.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  function handlePageChange(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-850 shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              User Management
            </h1>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Desktop view: Table */}
              <div className="hidden md:block">
                <UserTable
                  users={users}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                />
              </div>

              {/* Mobile view: Cards */}
              <div className="md:hidden space-y-4">
                {users.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "No users found matching your search"
                        : "No users available"}
                    </p>
                  </div>
                ) : (
                  users.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalUsers}
                  itemsPerPage={pagination.usersPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

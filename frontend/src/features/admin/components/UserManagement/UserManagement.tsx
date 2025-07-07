import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { getUsers, blockUser, unblockUser } from "../../services/userServices";
import { User, Pagination } from "../../types/user";

// Component imports
import SearchBar from "./SearchBar";
import PaginationComponent from "./Pagination";
import UserTable from "./UserTable";
import UserCard from "./UserCard";
import LoadingIndicator from "./LoadingIndicator";
import ConfirmSoftDeleteModal from "../../../user/componets/modals/ConfirmSoftDeleteModal";

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
  const [limit] = useState(5);
  const [pagination, setPagination] = useState<Pagination>({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    usersPerPage: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"block" | "unblock">("block");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ Debounced fetch
  const debouncedFetchUsers = debounce(
    async (query: string, pageNum: number) => {
      try {
        setLoading(true);
        const data = await getUsers(pageNum, limit, query);
        setUsers(data.users);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    500
  );

  const fetchUsers = (pageNum: number, query: string = searchQuery) => {
    setPage(pageNum);
    debouncedFetchUsers(query, pageNum);
  };

  useEffect(() => {
    fetchUsers(page, searchQuery);
  }, [page, searchQuery]);

  const handleBlock = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setModalAction("block");
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUnblock = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setModalAction("unblock");
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    console.log("selecteduser", selectedUser);
    try {
      if (modalAction === "block") {
        await blockUser(selectedUser.id);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, isBlocked: true } : user
          )
        );
      } else {
        await unblockUser(selectedUser.id);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, isBlocked: false } : user
          )
        );
      }

      setShowModal(false);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Error ${modalAction}ing user:`, apiError);
      setError(
        apiError.response?.data?.message || `Failed to ${modalAction} user`
      );
      setShowModal(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block">
                <UserTable
                  users={users}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                />
              </div>

              {/* Mobile View */}
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
                      key={user.id}
                      user={user}
                      onBlock={handleBlock}
                      onUnblock={handleUnblock}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <PaginationComponent
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

      {/* Confirm Modal */}
      <ConfirmSoftDeleteModal
        isOpen={showModal}
        onConfirm={handleConfirmAction}
        onCancel={() => setShowModal(false)}
        itemType={modalAction}
        itemName={selectedUser?.name || "User"}
        extraMessage={`Are you sure you want to ${modalAction} this user?`}
      />
    </div>
  );
};

export default UserManagement;

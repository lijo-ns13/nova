import React, { useEffect, useState } from "react";
import {
  Users,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getNetworkUsers,
  followUser,
  unfollowUser,
  NetworkUser,
} from "../services/FollowService";

import { useDebounce } from "../../../hooks/useDebounce";
import NetworkCard from "../componets/network/NetworkCard";
import LoadingSpinner from "../componets/viewableProfile/LoadingSpinner";
import EmptyState from "../componets/EmptyState";
import Navbar from "../componets/NavBar";

const ITEMS_PER_PAGE = 4;

const NetworkPage: React.FC = () => {
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const { users, pagination } = await getNetworkUsers(
        page,
        ITEMS_PER_PAGE,
        search
      );
      setNetworkUsers(users);
      setPagination(pagination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch network users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, debouncedSearch);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchUsers(page, debouncedSearch);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      updateUserFollowingStatus(userId, true);
      toast.success("Followed successfully");
    } catch {
      toast.error("Failed to follow user");
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      updateUserFollowingStatus(userId, false);
      toast.success("Unfollowed successfully");
    } catch {
      toast.error("Failed to unfollow user");
    }
  };

  const updateUserFollowingStatus = (userId: string, isFollowing: boolean) => {
    setNetworkUsers((prev) =>
      prev.map((user) =>
        user.user.id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 mt-14">
          <div className="flex items-center">
            <Users className="mr-3 h-8 w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Network
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Connect with professionals in your industry
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-sm sm:text-base placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[300px]">
            {/* <LoadingSpinner /> */}
            <p className="mt-4 text-gray-500">Loading network connections...</p>
          </div>
        ) : networkUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {networkUsers.map((networkUser) => (
                <NetworkCard
                  key={networkUser.user.id}
                  networkUser={networkUser}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`p-2 rounded-md ${
                      pagination.page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        pagination.page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`p-2 rounded-md ${
                      pagination.page === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              title={
                debouncedSearch ? "No matches found" : "Your network is empty"
              }
              description={
                debouncedSearch
                  ? "Try a different search keyword"
                  : "Start building your network by connecting with others"
              }
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default NetworkPage;

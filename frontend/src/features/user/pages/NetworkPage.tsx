import React, { useEffect, useState } from "react";
import {
  Users,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getNetworkUsers,
  followUser,
  unFollowUser,
} from "../services/FollowService";

import NetworkCard from "../componets/network/NetworkCard";
import LoadingSpinner from "../componets/viewableProfile/LoadingSpinner";
import EmptyState from "../componets/EmptyState";
import Navbar from "../componets/NavBar";

export interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  headline: string;
}

export interface NetworkUser {
  user: User;
  isFollowing: boolean;
}

const ITEMS_PER_PAGE = 4; // You can adjust this number based on your needs

const NetworkPage: React.FC = () => {
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNetworkUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNetworkUsers();
        setNetworkUsers(response);
        setFilteredUsers(response);
        setCurrentPage(1); // Reset to first page when data changes
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch network users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(networkUsers);
    } else {
      const filtered = networkUsers.filter(
        (user) =>
          user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.user.headline &&
            user.user.headline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, networkUsers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      updateUserFollowingStatus(userId, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to follow user");
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unFollowUser(userId);
      updateUserFollowingStatus(userId, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfollow user");
    }
  };

  const updateUserFollowingStatus = (userId: string, isFollowing: boolean) => {
    setNetworkUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user._id === userId ? { ...user, isFollowing } : user
      )
    );
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user._id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Loading network connections...</p>
      </div>
    );
  }

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
          <p className="mt-10 text-gray-600">
            Connect with professionals in your industry
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isSearchFocused ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base shadow-sm transition duration-150 ease-in-out"
            placeholder="Search by name, username, or headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {filteredUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedUsers.map((networkUser) => (
                <NetworkCard
                  key={networkUser.user._id}
                  networkUser={networkUser}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}{" "}
                  of {filteredUsers.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
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
              title={searchTerm ? "No matches found" : "Your network is empty"}
              description={
                searchTerm
                  ? "Try adjusting your search or explore more people"
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

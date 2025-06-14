import React, { useEffect, useState } from "react";
import { Users, AlertCircle, Search } from "lucide-react";
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
const NetworkPage: React.FC = () => {
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNetworkUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNetworkUsers();
        console.log("responsenetworkusers", response);
        setNetworkUsers(response);
        setFilteredUsers(response);
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
  }, [searchTerm, networkUsers]);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      setNetworkUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user._id === userId ? { ...user, isFollowing: true } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user._id === userId ? { ...user, isFollowing: true } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to follow user");
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unFollowUser(userId);
      setNetworkUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user._id === userId ? { ...user, isFollowing: false } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user._id === userId ? { ...user, isFollowing: false } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unfollow user");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Loading network connections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navbar />
      <header className="mt-16">
        <div className="flex items-center">
          <Users className="mr-3 h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Connect with professionals in your industry
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name, username, or headline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 rounded-md border border-red-100">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((networkUser) => (
            <NetworkCard
              key={networkUser.user._id}
              networkUser={networkUser}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No connections found"
          description={
            searchTerm
              ? "Try adjusting your search or explore more people"
              : "Start building your network by connecting with others"
          }
        />
      )}
    </div>
  );
};

export default NetworkPage;

import React, { useEffect, useState } from "react";
import { Users, AlertCircle } from "lucide-react";
import {
  getNetworkUsers,
  followUser,
  unFollowUser,
} from "../services/FollowService";
import { NetworkUser } from "../types/networkUser";
import NetworkCard from "../componets/network/NetworkCard";

import LoadingSpinner from "../componets/viewableProfile/LoadingSpinner";
import EmptyState from "../componets/EmptyState";

const NetworkPage: React.FC = () => {
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNetworkUsers();
        setNetworkUsers(response.data);
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

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      setNetworkUsers((prevUsers) =>
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
      <header className="mb-8">
        <div className="flex items-center">
          <Users className="mr-3 h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Connect with professionals in your industry
        </p>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 rounded-md border border-red-100">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {networkUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkUsers.map((networkUser) => (
            <NetworkCard
              key={networkUser.user._id}
              networkUser={networkUser}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      ) : (
        <EmptyState title={""} description={""} />
      )}
    </div>
  );
};

export default NetworkPage;

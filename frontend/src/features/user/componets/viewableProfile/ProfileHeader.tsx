import { useEffect, useState } from "react";
import { UserData } from "../../../../types/profile";
import { Camera } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { Link } from "react-router-dom";
import {
  getFollowers,
  getFollowing,
  NetworkUser,
  checkIsFollowUser,
  followUser,
  unFollowUser,
} from "../../services/FollowService";
import UserListModal from "../modals/UserListModal";
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  userData: UserData;
  currentUserId: string;
}
export interface FollowResponse {
  success: boolean;
  isFollowing?: boolean; // optional, if included
  message?: string; // <-- This must exist
}

const ProfileHeader = ({ userData, currentUserId }: ProfileHeaderProps) => {
  const { scrolled } = useScrollPosition();
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    userData.followers?.length || 0
  );
  const [followingCount, setFollowingCount] = useState(
    userData.following?.length || 0
  );

  const checkStatus = async () => {
    const res = await checkIsFollowUser(userData._id);
    setIsFollowing(res.isFollowing || false);
  };

  useEffect(() => {
    checkStatus();
    // Initialize counts from userData
    setFollowersCount(userData.followers?.length || 0);
    setFollowingCount(userData.following?.length || 0);
  }, [userData]);
  const fetchUsers = async (type: "followers" | "following") => {
    setIsLoading(true);
    try {
      const response =
        type === "followers"
          ? await getFollowers(userData._id)
          : await getFollowing(userData._id);
      console.log(response.data, "bla");
      setUsers(response.data);
      setModalType(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowersClick = () => fetchUsers("followers");
  const handleFollowingClick = () => fetchUsers("following");

  const closeModal = () => {
    setModalType(null);
    setUsers([]);
  };

  const refetchUsers = async () => {
    if (modalType) {
      await fetchUsers(modalType);
    }
  };

  const handleFollow = async () => {
    try {
      const res: FollowResponse = await followUser(userData._id);
      if (res.success) {
        setIsFollowing(true);
        // Increment followers count when following
        setFollowersCount((prev) => prev + 1);
        toast.success(`successfully followed ${userData.name}`);
      } else {
        toast.error(res.message || "Something went wrong while following");
      }
    } catch (error) {
      console.error("Follow Error:", error);
      toast.error("Failed to follow the user");
    }
  };

  const handleUnfollow = async () => {
    try {
      const res: FollowResponse = await unFollowUser(userData._id);
      if (res.success) {
        setIsFollowing(false);
        // Decrement followers count when unfollowing
        setFollowersCount((prev) => prev - 1);
        toast.success(`successfully unfollowed ${userData.name}`);
      } else {
        toast.error(res.message || "Something went wrong while unfollowing");
      }
    } catch (error) {
      console.error("Unfollow Error:", error);
      toast.error("Failed to unfollow the user");
    }
  };
  return (
    <>
      <section className="relative pt-20 pb-4 overflow-hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white w-full overflow-hidden">
            <div
              className="h-36 sm:h-48 md:h-64 lg:h-80 bg-gradient-to-r from-gray-50 to-gray-100 relative w-full overflow-hidden"
              style={{
                backgroundImage: userData?.coverPhoto
                  ? `url(${userData.coverPhoto})`
                  : undefined,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent opacity-60"
                style={{
                  transform: scrolled ? "translateY(-5%)" : "translateY(0)",
                  transition: "transform 0.5s ease-out",
                }}
              ></div>

              <button className="absolute right-4 top-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-sm hover:shadow-md transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-12 pt-2 pb-6 relative">
              <div className="relative -mt-16 sm:-mt-20 md:-mt-24 mb-4 flex justify-between items-end">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-md group relative">
                  <img
                    src={
                      userData?.profilePicture ||
                      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                    }
                    alt={userData?.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {userData?.name}
                  </h1>
                  {userData?.isVerified && (
                    <span className="inline-block ml-2 text-blue-600">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="text-gray-700 font-light tracking-wide sm:text-lg">
                  {userData?.headline}
                </p>

                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {userData?.location && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {userData.location}
                    </span>
                  )}

                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {userData?.experiences && userData.experiences.length > 0
                      ? userData.experiences[0].company
                      : "Not specified"}
                  </span>

                  {userData?.educations && userData.educations.length > 0 && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                      {userData.educations[0].institutionName}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4 items-center">
                  <button
                    onClick={handleFollowingClick}
                    disabled={isLoading}
                    className="text-black font-medium hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {followingCount} Following
                  </button>
                  <button
                    onClick={handleFollowersClick}
                    disabled={isLoading}
                    className="text-black font-medium hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {followersCount} Followers
                  </button>
                  <Link to={`/message/${userData._id}`}>
                    <button className="px-4 py-1.5 border border-gray-700 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                      Message
                    </button>
                  </Link>
                  {currentUserId !== userData._id &&
                    (isFollowing ? (
                      <button
                        onClick={handleUnfollow}
                        className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Follow
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserListModal
        isOpen={!!modalType}
        onClose={closeModal}
        title={modalType === "followers" ? "Followers" : "Following"}
        users={users}
        currentUserId={currentUserId}
        refetch={refetchUsers}
      />
    </>
  );
};

export default ProfileHeader;

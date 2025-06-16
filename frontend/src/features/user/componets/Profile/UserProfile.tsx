import React, { useEffect, useState } from "react";
import BaseModal from "../modals/BaseModal";
import { updateProfile as updateSlice } from "../../../auth/auth.slice";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/ProfileService";
import { useAppSelector } from "../../../../hooks/useAppSelector";
const ProfileImage = React.lazy(() => import("./ProfileImage"));
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import toast from "react-hot-toast";
import UserListModal from "../modals/UserListModal";
import { getFollowers, getFollowing } from "../../services/FollowService";

function UserProfile() {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: "",
    headline: "",
    about: "",
    profilePicture: "",
    username: "",
    _id: "",
  });
  const [updatingUserData, setUpdatingUserData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUserProfile(userId);
      if (res) {
        setFollowersCount(res.followers.length || 0);
        setFollowingCount(res.following.length || 0);
        setUserData({
          name: res.name || "",
          headline: res.headline || "",
          about: res.about || "",
          profilePicture: res.profilePicture || "",
          username: res.username,
          _id: res._id,
        });
        setUpdatingUserData({
          name: res.name || "",
          headline: res.headline || "",
          about: res.about || "",
          profilePicture: res.profilePicture || "",
          username: res.username,
          _id: res._id,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await updateUserProfile(userId, updatingUserData);
      if (res) {
        setUserData(updatingUserData);
        setIsEditModalOpen(false);
        dispatch(
          updateSlice({
            name: userData.name,
            headline: userData.headline,
          })
        );
      }
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Failed to update profile:", error);
      setFormError(
        error.response.data.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setFormError("");
    }
  }

  const fetchUsers = async (type: "followers" | "following") => {
    setIsLoadingUsers(true);
    try {
      const response =
        type === "followers"
          ? await getFollowers(userId)
          : await getFollowing(userId);
      setUsers(response.data);
      setModalType(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast.error(`Failed to load ${type}`);
    } finally {
      setIsLoadingUsers(false);
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
    // Refresh counts
    const res = await getUserProfile(userId);
    if (res) {
      setFollowersCount(res.followers.length || 0);
      setFollowingCount(res.following.length || 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 w-14 h-14 border-4 border-white/70 border-b-transparent rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 max-w-4xl mx-auto my-8">
        <div className="text-red-500 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
        <button
          onClick={getUserData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <ProfileImage />

        {/* Profile Details */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {userData.name || "Your Name"}
              </h1>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleFollowersClick}
                  className="text-white hover:underline cursor-pointer"
                >
                  <span className="font-bold">{followersCount}</span> Followers
                </button>
                <button
                  onClick={handleFollowingClick}
                  className="text-white hover:underline cursor-pointer"
                >
                  <span className="font-bold">{followingCount}</span> Following
                </button>
              </div>
              <p className="text-indigo-100 text-lg md:text-xl">
                {userData.headline || "Add your professional headline"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  Professional
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  Available for work
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  Remote
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <BaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleEditSubmit}>
          {/* Form fields would go here */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Followers/Following Modal */}
      <UserListModal
        isOpen={!!modalType}
        onClose={closeModal}
        title={modalType === "followers" ? "Followers" : "Following"}
        users={users}
        currentUserId={userId}
        refetch={refetchUsers}
      />
    </div>
  );
}

export default UserProfile;

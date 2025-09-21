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
import { handleApiError } from "../../../../utils/apiError";
export interface UserProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  headline: string;
  about: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  appliedJobCount: number;
  createdPostCount: number;
}

function UserProfile() {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<UserProfileData>({
    id: "",
    name: "",
    username: "",
    email: "",
    headline: "",
    about: "",
    profilePicture: "",
    followersCount: 0,
    followingCount: 0,
    appliedJobCount: 0,
    createdPostCount: 0,
  });
  const [updatingUserData, setUpdatingUserData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await getUserProfile(userId);
      const res = response.data;
      if (res) {
        setUserData({
          id: res.id,
          name: res.name,
          username: res.username,
          email: res.email,
          headline: res.headline,
          about: res.about,
          profilePicture: res.profilePicture,
          followersCount: res.followersCount,
          followingCount: res.followingCount,
          appliedJobCount: res.appliedJobCount,
          createdPostCount: res.createdPostCount,
        });
        setUpdatingUserData({
          id: res.id,
          name: res.name,
          username: res.username,
          email: res.email,
          headline: res.headline,
          about: res.about,
          profilePicture: res.profilePicture,
          followersCount: res.followersCount,
          followingCount: res.followingCount,
          appliedJobCount: res.appliedJobCount,
          createdPostCount: res.createdPostCount,
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
            name: updatingUserData.name,
            headline: updatingUserData.headline,
          })
        );
      }
      toast.success("Profile updated successfully");
    } catch (error) {
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

      setUsers(response); // you already typed this correctly
      setModalType(type); // this controls UI modal switch
    } catch (error) {
      const parsed = handleApiError(error, `Failed to load ${type}`);
      toast.error(parsed.message || `Unable to fetch ${type}`);
      // parsed.errors is ignored here since it's not a form
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
        <ProfileImage
          profilePicture={userData.profilePicture}
          setProfilePicture={(url: string) => {
            setUserData((prev) => ({ ...prev, profilePicture: url }));
            dispatch(updateSlice({ profilePicture: url }));
          }}
        />

        {/* Profile Details */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {userData.name || "Your Name"}
              </h1>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleFollowersClick}
                  className="text-white hover:underline cursor-pointer"
                >
                  <span className="font-bold">{userData.followersCount}</span>{" "}
                  Followers
                </button>
                <button
                  onClick={handleFollowingClick}
                  className="text-white hover:underline cursor-pointer"
                >
                  <span className="font-bold">{userData.followingCount}</span>{" "}
                  Following
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={updatingUserData.name}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  name: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={updatingUserData.username}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  username: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              name="headline"
              placeholder="e.g. Senior Software Engineer at Google"
              value={updatingUserData.headline}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  headline: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              name="about"
              placeholder="Tell us about yourself, your experience, and your goals"
              value={updatingUserData.about}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  about: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
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
        setUserData={setUserData}
      />
    </div>
  );
}

export default UserProfile;

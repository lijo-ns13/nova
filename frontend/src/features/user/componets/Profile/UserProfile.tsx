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
function UserProfile() {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: "",
    headline: "",
    about: "",
    profilePicture: "",
  });
  const [updatingUserData, setUpdatingUserData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  async function getUserData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUserProfile(userId);
      if (res) {
        setUserData({
          name: res.name || "",
          headline: res.headline || "",
          about: res.about || "",
          profilePicture: res.profilePicture || "",
        });
        // Initialize the form data with the same values
        setUpdatingUserData({
          name: res.name || "",
          headline: res.headline || "",
          about: res.about || "",
          profilePicture: res.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      console.log("resprofle", res);
    } catch (error) {
      toast.error("Profile updated failed");
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={getUserData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileImage />

        {/* Profile Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {userData.name}
              </h1>
              <p className="text-gray-600 mt-1">{userData.headline}</p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition"
            >
              Edit
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">About</h2>
            <p className="text-gray-600 mt-1">{userData.about}</p>
          </div>
        </div>
      </div>

      {/* Image View Modal */}
      <BaseModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Profile Image"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <img
              src={userData.profilePicture || "/api/placeholder/150/150"}
              alt="Profile"
              className="w-64 h-64 rounded-full object-cover"
            />
          </div>
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Upload New Image
            </button>
            {userData.profilePicture && (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Remove Image
              </button>
            )}
          </div>
        </div>
      </BaseModal>

      {/* Edit Profile Modal */}
      <BaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
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
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              placeholder="Enter your headline"
              value={updatingUserData.headline}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  headline: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              name="about"
              placeholder="Enter about yourself"
              value={updatingUserData.about}
              onChange={(e) =>
                setUpdatingUserData((state) => ({
                  ...state,
                  about: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
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
                "Save"
              )}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}

export default UserProfile;

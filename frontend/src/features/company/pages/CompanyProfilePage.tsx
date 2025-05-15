import { useState, useEffect } from "react";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../services/companyProfileService";
import { useAppSelector } from "../../../hooks/useAppSelector";
import ProfileImage from "../components/profile/ProfileImage";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import toast from "react-hot-toast";
import BaseModal from "../../user/componets/modals/BaseModal";

function CompanyProfilePage() {
  const dispatch = useAppDispatch();
  const { id: companyId } = useAppSelector((state) => state.auth);
  const [companyData, setCompanyData] = useState({
    companyName: "",
    about: "",
    email: "",
    industryType: "",
    foundedYear: "",
    location: "",
    profilePicture: "",
  });
  const [updatingCompanyData, setUpdatingCompanyData] = useState(companyData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    getCompanyData();
  }, []);

  async function getCompanyData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCompanyProfile();
      const ress = res.data;
      if (res) {
        setCompanyData({
          companyName: ress.companyName || "",
          about: ress.about || "",
          email: ress.email || "",
          industryType: ress.industryType || "",
          foundedYear: ress.foundedYear?.toString() || "",
          location: ress.location || "",
          profilePicture: ress.profilePicture || "",
        });
        // Initialize the form data with the same values
        setUpdatingCompanyData({
          companyName: ress.companyName || "",
          about: ress.about || "",
          email: ress.email || "",
          industryType: ress.industryType || "",
          foundedYear: ress.foundedYear?.toString() || "",
          location: ress.location || "",
          profilePicture: ress.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      setError("Failed to load company profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await updateCompanyProfile(companyId, updatingCompanyData);
      if (res) {
        setCompanyData(updatingCompanyData);
        setIsEditModalOpen(false);
        toast.success("Company profile updated successfully");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update company profile"
      );
      console.error("Failed to update company profile:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to update company profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setFormError("");
    }
  }

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
          onClick={getCompanyData}
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
        <ProfileImage imageUrl={companyData.profilePicture} />

        {/* Company Details */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {companyData.companyName || "Company Name"}
              </h1>
              <p className="text-indigo-100 text-lg md:text-xl">
                {companyData.industryType || "Industry Type"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  {companyData.location || "Location"}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  Founded: {companyData.foundedYear || "Year"}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  {companyData.email || "Email"}
                </span>
              </div>
            </div>

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
          </div>

          {companyData.about && (
            <div className="mt-6 max-w-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">
                About Us
              </h3>
              <p className="text-indigo-100 leading-relaxed">
                {companyData.about}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      <BaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company Profile"
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
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={updatingCompanyData.companyName}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
                  ...state,
                  companyName: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter company email"
              value={updatingCompanyData.email}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
                  ...state,
                  email: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Type
            </label>
            <input
              type="text"
              name="industryType"
              placeholder="e.g. Software Development, Finance, etc."
              value={updatingCompanyData.industryType}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
                  ...state,
                  industryType: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founded Year
            </label>
            <input
              type="text"
              name="foundedYear"
              placeholder="e.g. 2020"
              value={updatingCompanyData.foundedYear}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
                  ...state,
                  foundedYear: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter company location"
              value={updatingCompanyData.location}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
                  ...state,
                  location: e.target.value,
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
              placeholder="Tell us about your company"
              value={updatingCompanyData.about}
              onChange={(e) =>
                setUpdatingCompanyData((state) => ({
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
    </div>
  );
}

export default CompanyProfilePage;

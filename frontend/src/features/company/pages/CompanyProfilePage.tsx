import { useState, useEffect } from "react";
import { getCompanyProfile } from "../services/companyProfileService";
import ProfileImage from "../components/profile/ProfileImage";
import EditCompanyModal from "../components/profile/EditCompanyModal";
import { CompanyData } from "../types/company";
import toast from "react-hot-toast";

function CompanyProfilePage() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    username: "",
    companyName: "",
    about: "",
    email: "",
    industryType: "",
    foundedYear: "",
    location: "",
    profilePicture: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getCompanyData();
  }, []);

  async function getCompanyData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCompanyProfile();
      const data = res.data;
      if (data) {
        setCompanyData({
          username: data.username || "",
          companyName: data.companyName || "",
          about: data.about || "",
          email: data.email || "",
          industryType: data.industryType || "",
          foundedYear: data.foundedYear?.toString() || "",
          location: data.location || "",
          profilePicture: data.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      setError("Failed to load company profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleProfileUpdate = (updatedData: CompanyData) => {
    setCompanyData(updatedData);
    setIsEditModalOpen(false);
    toast.success("Company profile updated successfully");
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
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Image */}
          <ProfileImage />

          {/* Company Details */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                  {companyData.companyName || "Company Name"}
                </h1>
                <p className="text-indigo-100 text-lg md:text-xl">
                  {companyData.industryType || "Industry Type"}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-black rounded-full text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {companyData.location || "Location"}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-black rounded-full text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Founded: {companyData.foundedYear || "Year"}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-black rounded-full text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    {companyData.email || "Email"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-black transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
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
                <h3 className="text-xl font-semibold text-black mb-2">
                  About Us
                </h3>
                <p className="text-indigo-100 leading-relaxed">
                  {companyData.about}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      <EditCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={companyData}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
}

export default CompanyProfilePage;

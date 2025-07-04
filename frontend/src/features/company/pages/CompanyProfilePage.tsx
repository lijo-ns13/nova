import { useState, useEffect } from "react";
import { getCompanyProfile } from "../services/companyProfileService";
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-medium">{error}</span>
          </div>
          <button
            onClick={getCompanyData}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {companyData.profilePicture ? (
                  <img
                    src={companyData.profilePicture}
                    alt={companyData.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {companyData.companyName || "Company Name"}
                </h1>
                <p className="text-blue-100 text-lg">
                  {companyData.industryType || "Industry Type"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2 bg-white text-indigo-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2 shadow hover:shadow-md"
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
        </div>

        {/* Profile Details */}
        <div className="p-6 md:p-8">
          {/* Basic Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {companyData.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium">
                    {companyData.foundedYear || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {companyData.email || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">
                    {companyData.username || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {companyData.about && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                About Us
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {companyData.about}
                </p>
              </div>
            </div>
          )}
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

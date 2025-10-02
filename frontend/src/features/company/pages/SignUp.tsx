import React, { useState } from "react";
import { IndustryTypes } from "../../../constants/industryTypes";
import { signUpCompanyRequestSchema } from "../util/validators";
import { CompanyAuthService } from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import SiteInfoNav from "../../../components/SiteInfoNav";

import { handleApiError } from "../../../utils/apiError";
import { FiUpload, FiX, FiChevronDown } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SignUpErrors = {
  companyName?: string;
  email?: string;
  about?: string;
  foundedYear?: string;
  businessNumber?: string;
  industryType?: string;
  location?: string;
  documents?: string;
  password?: string;
  confirmPassword?: string;
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    about: "",
    foundedYear: new Date().getFullYear(),
    businessNumber: 0,
    password: "",
    confirmPassword: "",
    industryType: "",
    location: "",
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "foundedYear" || name === "businessNumber"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const validFiles = filesArray.filter((file) => {
        if (file.type !== "application/pdf") {
          toast.error(`File ${file.name} is not a PDF`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });
      setDocuments((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setServerError("");

    // Frontend validation
    const newErrors: SignUpErrors = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.companyName.trim()))
      newErrors.companyName = "Only letters and spaces allowed";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Invalid email format";

    if (!formData.about.trim()) newErrors.about = "About is required";
    else if (formData.about.trim().length < 10)
      newErrors.about = "About must be at least 10 characters long";

    if (!formData.foundedYear)
      newErrors.foundedYear = "Founded year is required";

    if (!formData.businessNumber || formData.businessNumber <= 0)
      newErrors.businessNumber = "Business number must be a positive number";
    // if (!formData.businessNumber >= 9999999999)
    // newErrors.businessNumber = "bussiness number between ";
    if (!formData.industryType.trim())
      newErrors.industryType = "Industry type is required";

    if (!formData.location.trim()) newErrors.location = "Location is required";
    else if (formData.location.trim().length < 4)
      newErrors.location = "Location must be at least 4 characters";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (!/\d/.test(formData.password))
      newErrors.password = "Password must contain at least one number";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (documents.length === 0)
      newErrors.documents = "At least one document (PDF) is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop submission
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("companyName", formData.companyName.trim());
      formPayload.append("email", formData.email.trim());
      formPayload.append("about", formData.about.trim());
      formPayload.append("foundedYear", String(formData.foundedYear));
      formPayload.append("businessNumber", String(formData.businessNumber));
      formPayload.append("industryType", formData.industryType.trim());
      formPayload.append("location", formData.location.trim());
      formPayload.append("password", formData.password);
      formPayload.append("confirmPassword", formData.confirmPassword);

      documents.forEach((file) => {
        formPayload.append("media", file); // backend expects "media"
      });

      const response = await CompanyAuthService.signUp(formPayload);

      toast.success(
        "Registration successful! Please check your email for verification."
      );
      setTimeout(() => {
        navigate(`/company/verify?email=${response.data.email}`);
      }, 2000);
    } catch (error) {
      console.log("error signup", error);
      // const parsedError = handleApiError(error);
      // console.log("pareserooor", parsedError);
      setErrors(error.errors);
      // if (error.errors) {
      //   setErrors(error.errors);
      // } else {
      // setServerError(parsedError.message);
      // toast.error(parsedError.message);
      // }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteInfoNav />
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Company Registration
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Create your company account to get started
              </p>
              {serverError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {serverError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* About */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    About Your Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="about"
                    name="about"
                    type="text"
                    value={formData.about}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.about ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.about && (
                    <p className="mt-1 text-sm text-red-600">{errors.about}</p>
                  )}
                </div>

                {/* Founded Year */}
                <div>
                  <label
                    htmlFor="foundedYear"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Founded Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="foundedYear"
                    name="foundedYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.foundedYear ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.foundedYear && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.foundedYear}
                    </p>
                  )}
                </div>

                {/* Business Number */}
                <div>
                  <label
                    htmlFor="businessNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Business Registration Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessNumber"
                    name="businessNumber"
                    type="number"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.businessNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessNumber}
                    </p>
                  )}
                </div>

                {/* Industry Type */}
                <div>
                  <label
                    htmlFor="industryType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Industry Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="industryType"
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.industryType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Industry</option>
                      {IndustryTypes.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronDown className="text-gray-400" />
                    </div>
                  </div>
                  {errors.industryType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.industryType}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}

                {/* Documents */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Documents (PDF only, max 5MB each)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">pdf only</p>
                    </div>
                  </div>
                  {errors.documents && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.documents}
                    </p>
                  )}

                  {/* Uploaded files preview */}
                  {documents.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Files:
                      </h3>
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {documents.map((file, index) => (
                          <li
                            key={index}
                            className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                          >
                            <div className="w-0 flex-1 flex items-center">
                              <span className="flex-1 w-0 truncate">
                                {file.name}
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <FiX className="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Already have an account?{" "}
                  <a
                    href="/company/signin"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </span>
                  ) : (
                    "Register Company"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

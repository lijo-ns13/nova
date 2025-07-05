import React, { useState } from "react";
import { IndustryTypes } from "../../../constants/industryTypes";
import { signUpCompanyRequestSchema } from "../util/validators";

import { signUpCompany } from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import SiteInfoNav from "../../../components/SiteInfoNav";
import { uploadToCloudinary } from "../services/CloudinaryNormalService";
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
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [foundedYear, setFoundedYear] = useState<number>(2025);
  const [businessNumber, setBusinessNumber] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [industryType, setIndustryType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setDocuments((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    console.log("documents", documents);
    const uploadedUrls = await Promise.all(
      documents.map(async (file) => {
        const url = await uploadToCloudinary(file);
        return url;
      })
    );
    console.log("uploadedUlrs", uploadedUrls);
    const formData = {
      companyName,
      email,
      about,
      foundedYear,
      businessNumber,
      industryType,
      location,
      password,
      confirmPassword,
      documents: uploadedUrls,
    };

    const result = signUpCompanyRequestSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formattedErrors);
      setLoading(false);
      return;
    }
    try {
      await signUpCompany(
        formData.companyName,
        formData.email,
        formData.about,
        formData.foundedYear,
        formData.businessNumber,
        formData.industryType,
        formData.documents,
        formData.password,
        formData.location,
        formData.confirmPassword
      );
      setCompanyName("");
      setEmail("");
      setAbout("");
      setFoundedYear(2025);
      setBusinessNumber(0);
      setIndustryType("");
      setLocation("");
      setPassword("");
      setConfirmPassword("");
      setDocuments([]);
      setErrors({});
      navigate(`/company/verify?email=${formData.email}`);
    } catch (error: any) {
      console.log("errors in signup", error);
      setServerError(error.Error || "An unexpected error occurred.");
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SiteInfoNav />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Company Signup{serverError && <p>{serverError}</p>}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <a
            href="/company/signin"
            className="font-medium text-black hover:text-gray-800"
          >
            Already have a company account
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter Company Name
          </label>
          <input
            name="companyName"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter email
          </label>
          <input
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter about
          </label>
          <input
            name="about"
            placeholder="About your company"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.about && (
            <p className="text-red-500 text-sm">{errors.about}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter founded year
          </label>
          <input
            name="foundedYear"
            type="number"
            placeholder="Founded Year"
            value={foundedYear}
            onChange={(e) => setFoundedYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.foundedYear && (
            <p className="text-red-500 text-sm">{errors.foundedYear}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter business number
          </label>
          <input
            name="businessNumber"
            type="number"
            placeholder="Business Number"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.businessNumber && (
            <p className="text-red-500 text-sm">{errors.businessNumber}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Select Industry Type
          </label>
          {/* INDUSTRY DROPDOWN */}
          <select
            name="industryType"
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Industry</option>
            {IndustryTypes.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industryType && (
            <p className="text-red-500 text-sm">{errors.industryType}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter Location
          </label>
          <input
            name="location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}

          {/* File Input */}
          <label className="block text-sm font-medium text-gray-700">
            Enter documents
          </label>
          <input
            type="file"
            name="documents"
            multiple
            accept="image/*" // This restricts to images
            placeholder="Only images"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.documents && (
            <p className="text-red-500 text-sm">{errors.documents}</p>
          )}

          {/* Display uploaded files with remove option */}
          <div className="space-y-2">
            {documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="block text-sm font-medium text-gray-700">
            Enter password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Enter Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            disabled={loading} // disable when loading
            className={`w-full p-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

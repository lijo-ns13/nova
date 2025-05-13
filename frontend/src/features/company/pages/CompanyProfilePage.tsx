import React, { useState, useEffect } from "react";
import { Loader2, Settings, AlertCircle } from "lucide-react";
import CompanyProfileService from "../services/companyProfileService";
import {
  getCompanyProfileWithDetails,
  updateCompanyProfile,
} from "../services/companyProfileService";
import { CompanyProfile } from "../types/company.types";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileDetails from "../components/profile/ProfileDetails";
import ProfileEditModal from "../components/profile/ProfileEditModal";
import ProfileImageModal from "../components/profile/ProfileImageModal";
import PasswordChangeModal from "../components/profile/PasswordChangeModal";
import SecuritySection from "../components/profile/SecuritySection";
import Button from "../../../components/ui/Button";

const CompanyProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await CompanyProfileService.getCompanyProfileWithDetails();

      if (response) {
        setProfile(response.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (err) {
      setError("An error occurred while fetching profile data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: CompanyProfile) => {
    setProfile(updatedProfile);
    setSuccessMessage("Profile updated successfully");
  };

  const handleImageUpdate = (imageUrl: string) => {
    if (profile) {
      setProfile({
        ...profile,
        imageUrl,
      });
      setSuccessMessage("Profile image updated successfully");
    }
  };

  const handleImageDelete = () => {
    if (profile) {
      setProfile({
        ...profile,
        imageUrl: undefined,
      });
      setSuccessMessage("Profile image removed successfully");
    }
  };

  const handlePasswordChanged = () => {
    setSuccessMessage("Password changed successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Failed to load profile data"}
          </p>
          <Button onClick={fetchProfileData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out">
          {successMessage}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <ProfileHeader
          profile={profile}
          onEditProfile={() => setIsEditModalOpen(true)}
          onEditImage={() => setIsImageModalOpen(true)}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Profile details */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileDetails profile={profile} />
          </div>

          {/* Sidebar - Security settings */}
          <div className="lg:col-span-1 space-y-6">
            <SecuritySection
              onChangePassword={() => setIsPasswordModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Profile Image Modal */}
      <ProfileImageModal
        currentImageUrl={profile.imageUrl}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageUpdate={handleImageUpdate}
        onImageDelete={handleImageDelete}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
};

export default CompanyProfilePage;

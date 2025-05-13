import React from "react";
import { Building2, MapPin, Globe } from "lucide-react";
import { CompanyProfile } from "../../types/company.types";
import Button from "../../../../components/ui/Button";

interface ProfileHeaderProps {
  profile: CompanyProfile;
  onEditProfile: () => void;
  onEditImage: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onEditImage,
}) => {
  const defaultImageUrl =
    "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden">
      {/* Cover image (using a gradient as background) */}
      <div className="h-48 w-full bg-gradient-to-r from-blue-800 to-indigo-900"></div>

      {/* Profile content */}
      <div className="px-6 pb-6">
        {/* Profile image and edit actions */}
        <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
          <div className="relative flex-shrink-0 mr-4">
            {/* Profile image */}
            <div
              className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden"
              onClick={onEditImage}
            >
              <img
                src={profile.imageUrl || defaultImageUrl}
                alt={`${profile.companyName} logo`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100 text-white cursor-pointer">
                <span className="text-sm font-medium">Change Image</span>
              </div>
            </div>
          </div>

          <div className="flex-grow mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {profile.companyName}
                </h1>
                <p className="text-blue-100 flex items-center text-sm md:text-base mt-1">
                  @{profile.username}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <Button
                  variant="outline"
                  onClick={onEditProfile}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Company brief info */}
        <div className="flex flex-wrap text-blue-50 gap-y-2">
          {profile.location && (
            <div className="flex items-center mr-6">
              <MapPin size={16} className="mr-1" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.industryType && (
            <div className="flex items-center mr-6">
              <Building2 size={16} className="mr-1" />
              <span>{profile.industryType}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center mr-6">
              <Globe size={16} className="mr-1" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white hover:underline transition-colors"
              >
                {profile.website.replace(/^https?:\/\//i, "")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

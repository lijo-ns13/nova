import React from "react";
import { CompanyProfile } from "../../types/company.types";
import { Users, Calendar, Mail } from "lucide-react";

interface ProfileDetailsProps {
  profile: CompanyProfile;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Company Information
      </h2>

      <div className="space-y-4">
        {/* About section */}
        {profile.about && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
              About
            </h3>
            <p className="text-gray-700 leading-relaxed">{profile.about}</p>
          </div>
        )}

        {/* Company details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Founded Year */}
          <div className="flex items-start">
            <div className="mt-0.5 mr-3 bg-blue-100 p-2 rounded-md">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Founded</h4>
              <p className="text-gray-800">{profile.foundedYear}</p>
            </div>
          </div>

          {/* Company Size */}
          {profile.companySize && (
            <div className="flex items-start">
              <div className="mt-0.5 mr-3 bg-purple-100 p-2 rounded-md">
                <Users size={18} className="text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Company Size
                </h4>
                <p className="text-gray-800">{profile.companySize} employees</p>
              </div>
            </div>
          )}

          {/* Email Contact */}
          <div className="flex items-start">
            <div className="mt-0.5 mr-3 bg-amber-100 p-2 rounded-md">
              <Mail size={18} className="text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="text-gray-800">{profile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;

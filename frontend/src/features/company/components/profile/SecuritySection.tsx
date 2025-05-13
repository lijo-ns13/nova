import React from "react";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface SecuritySectionProps {
  onChangePassword: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  onChangePassword,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <ShieldCheck size={20} className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Security</h2>
      </div>

      <div className="space-y-6">
        {/* Password section */}
        <div className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start">
            <div className="mt-0.5 mr-3 bg-blue-100 p-2 rounded-md">
              <KeyRound size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800">Password</h3>
              <p className="text-gray-500 text-sm mt-1">
                Update your password regularly to keep your account secure.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onChangePassword}
            className="flex-shrink-0"
          >
            Change Password
          </Button>
        </div>

        {/* Two-factor authentication - for future implementation */}
        <div className="flex items-start justify-between p-4 border border-gray-100 rounded-lg opacity-50">
          <div className="flex items-start">
            <div className="mt-0.5 mr-3 bg-gray-100 p-2 rounded-md">
              <Lock size={18} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Add an extra layer of security to your account.
              </p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;

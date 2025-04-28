"use client";

import { type FormEvent, useState } from "react";
import { changePassword } from "../../services/ProfileService";
import { AlertCircle, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";

function ChangePasswordForm({ onComplete }: { onComplete?: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  // Check if passwords match
  const checkPasswordMatch = () => {
    setPasswordMatch(newPassword === confirmPassword || confirmPassword === "");
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Form validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      console.log("res", res);
      setSuccess(true);
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);

      // Call onComplete callback if provided
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    } catch (error: any) {
      console.error(
        "Error changing password:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          <Lock className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle
            className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
            size={16}
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle
            className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
            size={16}
          />
          <p className="text-green-700 text-sm">
            Password changed successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="current-password"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
                if (confirmPassword) checkPasswordMatch();
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10 transition-all"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">
                  Password strength:
                </span>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength <= 1
                      ? "text-red-500"
                      : passwordStrength === 2
                      ? "text-yellow-500"
                      : passwordStrength === 3
                      ? "text-green-500"
                      : "text-green-600"
                  }`}
                >
                  {passwordStrength === 0 && "Very weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Medium"}
                  {passwordStrength === 3 && "Strong"}
                  {passwordStrength === 4 && "Very strong"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength <= 1
                      ? "bg-red-500"
                      : passwordStrength === 2
                      ? "bg-yellow-500"
                      : passwordStrength === 3
                      ? "bg-green-500"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${passwordStrength * 25}%` }}
                ></div>
              </div>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li
                  className={`flex items-center ${
                    newPassword.length >= 8 ? "text-green-600" : ""
                  }`}
                >
                  <span
                    className={`inline-block w-3 h-3 mr-2 rounded-full ${
                      newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></span>
                  At least 8 characters
                </li>
                <li
                  className={`flex items-center ${
                    /[A-Z]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  <span
                    className={`inline-block w-3 h-3 mr-2 rounded-full ${
                      /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></span>
                  At least one uppercase letter
                </li>
                <li
                  className={`flex items-center ${
                    /[0-9]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  <span
                    className={`inline-block w-3 h-3 mr-2 rounded-full ${
                      /[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></span>
                  At least one number
                </li>
                <li
                  className={`flex items-center ${
                    /[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  <span
                    className={`inline-block w-3 h-3 mr-2 rounded-full ${
                      /[^A-Za-z0-9]/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></span>
                  At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordMatch(
                  newPassword === e.target.value || e.target.value === ""
                );
              }}
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-500 pr-10 transition-all ${
                !passwordMatch && confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {!passwordMatch && confirmPassword && (
            <p className="text-xs text-red-500 mt-1 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Passwords don't match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mt-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center">
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
              Changing Password...
            </span>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;

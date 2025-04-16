import { FormEvent, useState } from "react";
import { changePassword } from "../../services/ProfileService";
import { AlertCircle, CheckCircle, Lock } from "lucide-react";

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Lock className="mr-2 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle
            className="text-red-500 mr-2 flex-shrink-0 mt-0.5"
            size={16}
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
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
          <input
            id="current-password"
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              checkPasswordStrength(e.target.value);
              if (confirmPassword) checkPasswordMatch();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password strength indicator */}
          {newPassword && (
            <div className="mt-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">
                  Password strength:
                </span>
                <span className="text-xs font-medium">
                  {passwordStrength === 0 && "Very weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Medium"}
                  {passwordStrength === 3 && "Strong"}
                  {passwordStrength === 4 && "Very strong"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div
                  className={`h-1.5 rounded-full ${
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
              <ul className="text-xs text-gray-500 mt-1">
                <li
                  className={`${
                    newPassword.length >= 8 ? "text-green-600" : ""
                  }`}
                >
                  • At least 8 characters
                </li>
                <li
                  className={`${
                    /[A-Z]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  • At least one uppercase letter
                </li>
                <li
                  className={`${
                    /[0-9]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  • At least one number
                </li>
                <li
                  className={`${
                    /[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""
                  }`}
                >
                  • At least one special character
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
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMatch(
                newPassword === e.target.value || e.target.value === ""
              );
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !passwordMatch && confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {!passwordMatch && confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;

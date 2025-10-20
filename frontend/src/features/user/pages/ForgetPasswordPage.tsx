import { useState } from "react";
import { forgetPasswordByEmail } from "../services/AuthServices";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import SiteInfoNav from "../../../components/SiteInfoNav";
import SiteInfoFooter from "../../../components/SiteInfoFooter";

const ForgetSchema = z.object({
  email: z.string().email("Invalid email format"),
});

function ForgetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [serverError, setServerError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (serverError) setServerError("");
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setServerError("");

    const result = ForgetSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: { email?: string } = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as "email"] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setErrors({});
    try {
      await forgetPasswordByEmail(email);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Error in forgetPassword:", err);
      setServerError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteInfoNav />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email to receive a password reset link
            </p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-700">{serverError}</p>
              </div>
            </div>
          )}

          {showSuccess ? (
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-green-800">
                Password Reset Email Sent!
              </h3>
              <p className="mt-2 text-sm text-green-600">
                Check your inbox for instructions to reset your password.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`block w-full pl-10 pr-4 py-3 border ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    } rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 text-sm shadow-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
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
                    Sending Reset Link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Return to Login
                </a>
              </div>
            </form>
          )}
        </div>
      </main>
      <SiteInfoFooter />
    </div>
  );
}

export default ForgetPasswordPage;

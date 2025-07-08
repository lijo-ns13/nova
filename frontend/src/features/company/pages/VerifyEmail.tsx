import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { CompanyAuthService } from "../services/AuthServices";
import toast from "react-hot-toast";
import SiteInfoNav from "../../../components/SiteInfoNav";
import SiteInfoFooter from "../../../components/SiteInfoFooter";
import { handleApiError } from "../../../utils/apiError";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState<number>(() => {
    const savedTime = localStorage.getItem("otpTimer");
    return savedTime ? parseInt(savedTime, 10) : 60;
  });

  const [isResendAllowed, setIsResendAllowed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Redirecting...");
      navigate("/signup");
      return;
    }

    inputRef.current?.focus();

    const counter: NodeJS.Timeout = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(counter);
          setIsResendAllowed(true);
          localStorage.removeItem("otpTimer");
          return 0;
        }
        const newTimer = prev - 1;
        localStorage.setItem("otpTimer", newTimer.toString());
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(counter);
  }, [email, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isVerifying) return;

    setErrors({});
    setServerError("");

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setIsVerifying(true);
      await CompanyAuthService.verifyOTP({ email: email!, otp: otp.trim() });

      toast.success("Email verified successfully!");
      navigate("/company/signin");
    } catch (error) {
      const parsedError = handleApiError(error, "Failed to verify OTP");
      if (parsedError.errors) {
        setErrors(parsedError.errors);
      } else {
        setServerError(parsedError.message);
        toast.error(parsedError.message);
      }
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Email missing!");
      return;
    }

    try {
      setIsResending(true);
      await CompanyAuthService.resendOTP(email);
      toast.success("OTP resent successfully!");
      setTimer(60);
      setIsResendAllowed(false);
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <SiteInfoNav />
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We sent an OTP to{" "}
            <strong className="text-blue-600">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              disabled={isVerifying}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.otp && (
              <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
            )}
          </div>

          {serverError && (
            <div className="text-red-600 text-sm text-center mt-2">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !otp}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isResendAllowed ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-600">
              Resend OTP in <span className="font-bold">{timer}s</span>
            </p>
          )}
        </div>
      </div>
      <SiteInfoFooter />
    </div>
  );
}

export default VerifyEmail;

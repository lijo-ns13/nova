// RefundPage.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import {
  getLatestSession,
  requestRefund,
  RefundSessionData,
} from "../services/subStripeService";
import { updateSubscriptionStatus, logout } from "../../auth/auth.slice";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import Navbar from "../componets/NavBar";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import Button from "../../../components/ui/Button";

const RefundPage: React.FC = () => {
  const [sessionData, setSessionData] = useState<RefundSessionData | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: userId } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getLatestSession(userId);
        setSessionData(data);
        console.log("sessiondata", sessionData);
      } catch (err: any) {
        setSubmitStatus(
          err?.response?.data?.message ||
            "Failed to fetch your subscription details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchSession();
  }, [userId]);

  useEffect(() => {
    if (!loading && !sessionData) {
      setTimeout(() => navigate("/feed"), 2000);
    }
  }, [loading, sessionData, navigate]);

  const handleRefund = async () => {
    if (!reason.trim()) {
      setSubmitStatus("Please provide a reason for your refund request.");
      return;
    }

    if (!sessionData?.stripeSessionId) {
      setSubmitStatus("We couldn't find an active subscription to refund.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus("Processing your refund request...");

      await requestRefund({
        stripeSessionId: sessionData.stripeSessionId,
        reason,
      });

      // ✅ Only update slice on success
      dispatch(
        updateSubscriptionStatus({
          isSubscriptionActive: false,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          subscriptionCancelled: true,
        })
      );

      toast.success("Refund requested successfully!");
      setSubmitStatus("Your refund request has been submitted successfully!");
      setReason("");

      setTimeout(() => navigate("/feed"), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "We encountered an error processing your refund.";

      // Optional: Log out user if refund not eligible
      if (
        message.toLowerCase().includes("not eligible") ||
        message.toLowerCase().includes("refund period expired")
      ) {
        toast.error(message);
        dispatch(logout());
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      setSubmitStatus(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading your subscription details...</p>
      </div>
    );

  if (!sessionData)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-red-500"
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
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No eligible subscription found
        </h2>
        <p className="text-gray-600 max-w-md">
          We couldn't find an active subscription eligible for refund. You'll be
          redirected shortly.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 sm:py-12">
      <Navbar />
      <div className="max-w-md mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">
            Request a Refund
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 space-y-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-600 text-sm">
                You're requesting a refund for your recent subscription. Once
                refunded, you won't be able to subscribe again until the next
                billing cycle.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Plan:</span>
                <span className="text-gray-800">{sessionData.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Purchase Date:
                </span>
                <span className="text-gray-800">
                  {new Date(sessionData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Please tell us why you're requesting a refund
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your feedback helps us improve..."
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="w-full justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Request Refund"
              )}
            </Button>

            <Button
              onClick={() => navigate("/feed")}
              disabled={isSubmitting}
              variant="secondary"
              className="w-full justify-center"
            >
              Cancel
            </Button>
          </div>

          {submitStatus && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                submitStatus.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : submitStatus.includes("Processing")
                  ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {submitStatus}
            </div>
          )}
        </div>
      </div>

      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          handleRefund();
        }}
        title="Confirm Refund Request"
        description="Are you sure you want to proceed? You won't be able to re-subscribe until the next billing cycle."
        confirmText="Yes, proceed with refund"
      />
    </div>
  );
};

export default RefundPage;

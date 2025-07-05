import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import {
  getLatestSession,
  requestRefund,
  RefundSessionData,
} from "../services/subStripeService";
import { updateSubscriptionStatus } from "../../auth/auth.slice";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
const RefundPage: React.FC = () => {
  const [sessionData, setSessionData] = useState<RefundSessionData | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: userId, isSubscriptionTaken } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isSubscriptionTaken) {
      navigate("/feed");
    }
  }, [isSubscriptionTaken, navigate]);
  useEffect(() => {
    if (!loading && sessionData === null) {
      // Add a small delay if you want to show the error briefly
      setTimeout(() => {
        navigate("/feed");
      }, 1500); // Optional: 1.5s delay to show the message
    }
  }, [loading, sessionData, navigate]);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getLatestSession(userId);
        setSessionData(data);
      } catch (err: any) {
        console.error("Error fetching session:", err);
        setSubmitStatus(err.message || "❌ Failed to fetch session");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSession();
  }, [userId]);

  const handleRefund = async () => {
    if (!reason.trim()) {
      setSubmitStatus("❌ Please provide a reason for refund.");
      return;
    }

    if (!sessionData?.stripeSessionId) {
      setSubmitStatus("❌ No valid Stripe session found.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus("🔄 Processing refund...");
      await requestRefund({
        stripeSessionId: sessionData.stripeSessionId,
        reason,
      });

      setSubmitStatus("✅ Refund request submitted successfully.");
      toast.success("Refund requested successfully.");

      // ⬇️ Update subscription status in Redux store
      dispatch(updateSubscriptionStatus({ isSubscriptionTaken: false }));

      setReason("");

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/feed");
      }, 2000);
    } catch (err: any) {
      console.error("Refund request error:", err);
      setSubmitStatus(err.message || "❌ Refund request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  if (!sessionData)
    return (
      <div className="text-center mt-10 text-red-500">
        No eligible subscription found for refund.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Request a Refund</h1>

      <div className="mb-4 text-gray-700">
        <p>
          <strong>Plan:</strong> {sessionData.planName}
        </p>
        <p>
          <strong>Purchased At:</strong>{" "}
          {new Date(sessionData.createdAt).toLocaleString()}
        </p>
      </div>

      <label
        htmlFor="reason"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Reason for refund:
      </label>
      <textarea
        id="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
        placeholder="Explain why you are requesting a refund..."
        disabled={isSubmitting}
      />

      <button
        onClick={handleRefund}
        className={`mt-4 w-full bg-red-500 text-white py-2 px-4 rounded transition ${
          isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-red-600"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Submit Refund Request"}
      </button>

      {submitStatus && (
        <div
          className={`mt-4 text-center text-sm ${
            submitStatus.startsWith("✅")
              ? "text-green-600"
              : submitStatus.startsWith("🔄")
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {submitStatus}
        </div>
      )}
    </div>
  );
};

export default RefundPage;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import userAxios from "../utils/userAxios";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { updateSubscriptionStatus } from "../features/auth/auth.slice";
import { useAppDispatch } from "../hooks/useAppDispatch";

interface PaymentInfo {
  orderId: string;
  amount: number;
  currency: string;
  planName: string;
  sessionId: string;
  expiresAt: string;
  receiptUrl?: string;
}

type Status = "loading" | "success" | "already-confirmed" | "error";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<Status>("loading");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await userAxios.get(
          `/api/stripe/confirm-session/${sessionId}`
        );
        const { message, data } = res.data;

        if (message === "Payment already confirmed") {
          setStatus("already-confirmed");
          setPaymentInfo(data);
          dispatch(
            updateSubscriptionStatus({
              isSubscriptionActive: true,
              subscriptionStartDate: new Date().toISOString(),
              subscriptionEndDate: data.expiresAt,
              subscriptionCancelled: false,
            })
          );
        } else if (message === "Subscription activated successfully") {
          setStatus("success");
          setPaymentInfo(data);
          dispatch(
            updateSubscriptionStatus({
              isSubscriptionActive: true,
              subscriptionStartDate: new Date().toISOString(),
              subscriptionEndDate: data.expiresAt,
              subscriptionCancelled: false,
            })
          );
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("❌ Payment confirmation failed:", err);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [sessionId]);

  const renderMessage = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 animate-spin" />
            Confirming your payment...
          </div>
        );
      case "success":
      case "already-confirmed":
        return (
          <div className="text-green-600 flex items-center justify-center font-semibold text-lg">
            <CheckCircle className="w-6 h-6 mr-2" />
            Subscription Activated Successfully!
          </div>
        );
      case "error":
      default:
        return (
          <div className="text-red-600 flex items-center justify-center font-semibold text-lg">
            <XCircle className="w-6 h-6 mr-2" />
            Failed to confirm your payment.
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Payment Status
        </h1>
        <p className="text-gray-500 text-sm">
          {status === "loading"
            ? "Verifying your payment..."
            : "Here are your payment details"}
        </p>
      </div>

      <div className="mb-6">{renderMessage()}</div>

      {paymentInfo && (
        <div className="text-sm space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between">
            <span className="font-medium">Plan Name:</span>
            <span>{paymentInfo.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Paid:</span>
            <span>
              ₹{paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
            </span>
          </div>
          {/* <div className="flex justify-between">
            <span className="font-medium">Subscription Expires:</span>
            <span>{new Date(paymentInfo.expiresAt).toLocaleDateString()}</span>
          </div> */}
          <div className="flex justify-between break-all">
            <span className="font-medium">Order ID:</span>
            <span className="text-right">{paymentInfo.orderId}</span>
          </div>
        </div>
      )}

      {paymentInfo?.receiptUrl && (
        <div className="mt-6 text-center">
          <a
            href={paymentInfo.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            Download Receipt
          </a>
        </div>
      )}

      {status !== "loading" && (
        <div className="mt-8 text-center">
          <a
            href="/feed"
            className="inline-block px-8 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

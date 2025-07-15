import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import userAxios from "../utils/userAxios";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

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
        console.log("res", res);
        if (message === "Payment already confirmed") {
          setStatus("already-confirmed");
          setPaymentInfo(data);
        } else if (message === "Subscription activated successfully") {
          setStatus("success");
          setPaymentInfo(data);
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
            <Clock className="w-5 h-5 mr-2" />
            Confirming your payment...
          </div>
        );
      case "success":
      case "already-confirmed":
        return (
          <div className="text-green-600 flex items-center justify-center font-semibold text-lg">
            <CheckCircle className="w-6 h-6 mr-2" />
            Subscription activated successfully!
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
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Status</h1>

      {process.env.NODE_ENV !== "production" && (
        <div className="mb-4 text-center text-xs text-orange-500 flex justify-center items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Test mode (Sandbox)
        </div>
      )}

      <div className="mb-6">{renderMessage()}</div>

      {paymentInfo && (
        <div className="text-sm space-y-2 text-gray-800">
          <div>
            <span className="font-medium text-gray-600">Plan Name:</span>{" "}
            {paymentInfo.planName}
          </div>
          <div>
            <span className="font-medium text-gray-600">Amount Paid:</span> ₹
            {paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-gray-600">
              Subscription Expires:
            </span>{" "}
          </div>
          <div className="break-all">
            <span className="font-medium text-gray-600">Order ID:</span>{" "}
            {paymentInfo.orderId}
          </div>
        </div>
      )}

      {paymentInfo?.receiptUrl && (
        <div className="mt-6 text-center">
          <a
            href={paymentInfo.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            Download Receipt
          </a>
        </div>
      )}

      {status !== "loading" && (
        <div className="mt-6 text-center">
          <a
            href="/feed"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;

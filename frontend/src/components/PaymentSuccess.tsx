import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { updateSubscriptionStatus } from "../features/auth/auth.slice";
import { useAppSelector } from "../hooks/useAppSelector";
import axios from "axios";

const PaymentSuccess = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    amount: 0,
    currency: "inr",
    planName: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get("session_id");
      if (sessionId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/stripe/session-details/${sessionId}`
          );
          console.log("response stripe", response);
          setOrderDetails({
            orderNumber: response.data.transaction.stripeSessionId,
            amount: response.data.transaction.amount,
            currency: response.data.transaction.currency,
            planName: response.data.transaction.planName,
          });
        } catch (error) {
          console.error("Failed to fetch order details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      dispatch(
        updateSubscriptionStatus({
          isSubscriptionTaken: true,
        })
      );
      fetchOrderDetails();
    }
  }, [isAuthenticated, dispatch, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for subscribing to {orderDetails.planName}.
          </p>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  {/* <span className="text-gray-600">Order Number</span> */}
                  {/* <span className="font-medium">
                    {orderDetails.orderNumber.substring(0, 8)}
                  </span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">{orderDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">
                    {orderDetails.currency.toUpperCase()} {orderDetails.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                What's next?
              </h3>
              <p className="mt-2 text-gray-600">
                Your subscription is now active. You'll receive an email
                confirmation shortly.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/feed"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React from "react";
import { XCircle, ArrowRight, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Possible Reasons
              </h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Insufficient funds in your account
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Incorrect card details entered
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Card expired or not supported
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Temporary bank service issue
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
              <p className="mt-2 text-gray-600">
                Contact our support team at support@example.com or call +1 (555)
                123-4567
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Try Payment Again
              </Link>
              <Link
                to="/"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

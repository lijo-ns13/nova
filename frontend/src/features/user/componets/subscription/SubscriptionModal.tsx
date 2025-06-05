// src/components/SubscriptionModal.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const SubscriptionModal = ({ onClose }: { onClose: () => void }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { name: "Unlimited Job Applications", icon: "📨" },
    { name: "Unlimited Job Creation", icon: "🛠️" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full animate-fade-in border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upgrade to Premium
              </h2>
              <p className="text-gray-500 text-sm">
                Logged in at {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium text-center">
                ✨ Get full access to all premium features
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-xl mr-3 text-blue-600">
                    {feature.icon}
                  </span>
                  <span className="text-gray-700">{feature.name}</span>
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">
                  Premium Subscription
                </span>
                {/* <span className="text-gray-900 font-bold">$9.99</span> */}
              </div>
              <p className="text-gray-500 text-sm mb-4">Flexible duration -</p>

              <Link to={"/subscription"}>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200">
                  Subscribe Now
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex space-x-4 mb-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-xs">
              Secure payment · 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Lock, Clock, Home, Shield, AlertTriangle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const LockedDashboard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {/* Glass-like card container */}
      <div className="w-full max-w-xl relative overflow-hidden rounded-2xl backdrop-blur-sm">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-red-500 opacity-10"></div>

        {/* Main content container */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-200 border-opacity-20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Red banner at top */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">Security Notice</span>
              </div>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                Pending Access
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="p-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-red-100 bg-opacity-20 mb-4">
                <Lock className="h-12 w-12 text-red-400" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Account Locked
              </h2>
              <p className="text-gray-300 mb-6">
                Your access to the company dashboard is currently restricted
              </p>

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 bg-opacity-50 text-gray-300 text-sm mb-8">
                <Clock className="mr-2 h-4 w-4 text-blue-400" />
                <span>Verification in progress</span>
              </div>
            </div>

            {/* Status card */}
            <div className="bg-black bg-opacity-20 rounded-xl p-6 mb-8 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-900 bg-opacity-50">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Administrator Verification Required
                  </h3>
                  <p className="text-gray-300 text-sm">
                    An administrator will verify your account within{" "}
                    <span className="font-semibold text-white">24 hours</span>.
                    After verification is complete, you will be granted access
                    to the company dashboard.
                  </p>

                  <div className="mt-4 bg-gray-800 bg-opacity-50 rounded-lg p-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Verification Progress
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="space-y-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <p className="text-blue-400">Requested</p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 bg-opacity-30 mx-auto flex items-center justify-center">
                          <span className="text-blue-200 text-xs">⋯</span>
                        </div>
                        <p className="text-gray-400">In Review</p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-4 h-4 rounded-full bg-gray-700 mx-auto"></div>
                        <p className="text-gray-500">Approved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to={"/"}>
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center">
                  <span>Return to Home</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4 bg-black bg-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
              <div>© 2025 Your Company Name. All rights reserved.</div>
              <div className="mt-2 md:mt-0">
                Need help? Contact{" "}
                <span className="text-blue-400">support@yourcompany.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedDashboard;

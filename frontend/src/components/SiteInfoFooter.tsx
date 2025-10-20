import React from "react";
import { useNavigate } from "react-router-dom";

const SiteInfoFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white">Nova</h3>
            <p className="mt-2 text-sm">
              Shining bright in your career journey.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/about")}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <button
                  onClick={() => navigate("/privacy")}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/terms")}
                  className="text-sm hover:text-blue-400 transition-colors duration-200"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Nova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteInfoFooter;

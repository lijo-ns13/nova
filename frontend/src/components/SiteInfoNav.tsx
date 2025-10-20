import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import novalog from "../assets/novalogo.png";

const SiteInfoNav: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={novalog} alt="Nova Logo" className="h-8 w-auto" />
              <span className="text-xl font-extrabold text-blue-600">Nova</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Contact
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-800 hover:text-blue-600 w-full text-left transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setIsMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-800 hover:text-blue-600 w-full text-left transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => {
                navigate("/contact");
                setIsMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-800 hover:text-blue-600 w-full text-left transition-colors duration-200"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteInfoNav;

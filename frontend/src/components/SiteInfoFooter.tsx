import React from "react";
import { useNavigate } from "react-router-dom";

const SiteInfoFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 px-4 py-6 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300">
      <div className="flex flex-wrap justify-center gap-4 mb-2">
        <button onClick={() => navigate("/")} className="hover:underline">
          Home
        </button>
        <button onClick={() => navigate("/about")} className="hover:underline">
          About
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="hover:underline"
        >
          Contact
        </button>
      </div>
      <p>&copy; {new Date().getFullYear()} Nova. All rights reserved.</p>
    </footer>
  );
};

export default SiteInfoFooter;

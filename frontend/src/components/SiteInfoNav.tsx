// src/components/common/SiteInfoNav.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import novalog from "../assets/novalogo.png";

const SiteInfoNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-4 sm:px-8 py-3 flex items-center justify-start bg-white dark:bg-gray-900 shadow-md fixed top-0 z-50">
      <div
        className="flex items-center gap-2 sm:gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={novalog} alt="Nova Logo" className="h-8 sm:h-9 w-auto" />
        <span className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Nova
        </span>
      </div>
    </nav>
  );
};

export default SiteInfoNav;

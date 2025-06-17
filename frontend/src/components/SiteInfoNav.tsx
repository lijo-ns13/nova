import React from "react";
import { useNavigate } from "react-router-dom";
import novalog from "../assets/novalogo.png";

const SiteInfoNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-4 py-4 bg-white dark:bg-gray-900 shadow fixed top-0 z-50">
      <div className="flex items-center justify-start">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={novalog} alt="Nova Logo" className="h-10 md:h-10 w-auto" />
        </div>
      </div>
    </nav>
  );
};

export default SiteInfoNav;

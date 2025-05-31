import { Outlet } from "react-router-dom";

import { useState, useEffect } from "react";
import Navbar from "../features/user/componets/NavBar";
import ProfileCard from "../features/user/componets/ProfileCard";

const UserLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Fixed height container to prevent layout shifts */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 gap-5">
        {/* Left column - Profile card (only visible on desktop/tablet) */}
        {!isMobile && (
          <div className="w-64 lg:w-72 sticky top-20 self-start min-h-[300px]">
            <ProfileCard />
          </div>
        )}

        {/* Main content - Takes full width on mobile, flexible width on desktop */}
        <main
          className={`flex-1 w-full min-h-[70vh] ${
            !isMobile ? "" : "max-w-none"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

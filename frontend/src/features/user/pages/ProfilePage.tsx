import React, { Suspense, useState } from "react";

import Navbar from "../componets/NavBar";
import SkillsManager from "../componets/skill/SkillsManager";
import UserPostsSection from "../componets/Profile/post/UserPostSection";
import SubscriptionCard from "../../admin/components/Subscription/SubscriptionCard";
import CurrentSubscriptionCard from "../componets/SubcriptionCard";

// Lazy-loaded components
const UserProfile = React.lazy(
  () => import("../componets/Profile/UserProfile")
);
const AddSection = React.lazy(() => import("../componets/Profile/AddSection"));
const ExperienceSection = React.lazy(
  () => import("../componets/Profile/ExperienceSection")
);
const ProjectSection = React.lazy(
  () => import("../componets/Profile/ProjectSection")
);
// const CertificateSection = React.lazy(
//   () => import("../componets/Profile/CertificateSection")
// );
const EducationSection = React.lazy(
  () => import("../componets/Profile/EducationSection")
);

// Loading component for suspense fallback
const SectionLoader = () => (
  <div className="w-full h-64 bg-gray-100/50 backdrop-blur-sm rounded-xl animate-pulse flex items-center justify-center">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-1 left-1 w-14 h-14 border-4 border-indigo-400 border-b-transparent rounded-full animate-spin-slow"></div>
    </div>
  </div>
);

// Mock user ID for demonstration - should be replaced with actual user ID from auth
const CURRENT_USER_ID = "6819e4b63420abc944d45209";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Experience");

  const tabs = [
    { id: "Experience", label: "Experience" },
    { id: "Education", label: "Education" },
    { id: "Projects", label: "Projects" },
    // { id: "Certificates", label: "Certificates" },
    { id: "Posts", label: "Posts" },
    { id: "Skills", label: "Skills" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero section with profile */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-16 pb-32 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<SectionLoader />}>
            <UserProfile />
          </Suspense>
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -bottom-10 left-0 right-0 h-20 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0% 100%)" }}
        ></div>
        <div
          className="absolute -bottom-10 left-0 right-0 h-20 bg-indigo-600/20"
          style={{ clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0% 100%)" }}
        ></div>
      </div>

      {/* Main content with floating card look */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-32 -mt-32 opacity-70"></div>

          <div className="relative flex justify-between items-center border-b border-gray-200 pb-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Profile Settings
              </span>
              <span className="ml-3 text-xs font-normal px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                Professional
              </span>
            </h2>
            <Suspense
              fallback={
                <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-lg"></div>
              }
            >
              <AddSection />
            </Suspense>
          </div>

          {/* Profile sections with tabs */}
          <div className="mt-8 relative">
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-3 px-3 sm:px-5 border-b-2 font-medium text-sm sm:text-base transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content sections */}
            <div className="space-y-12">
              {activeTab === "Experience" && (
                <Suspense fallback={<SectionLoader />}>
                  <ExperienceSection />
                </Suspense>
              )}

              {activeTab === "Education" && (
                <Suspense fallback={<SectionLoader />}>
                  <EducationSection />
                </Suspense>
              )}

              {/* {activeTab === "Certificates" && (
                <Suspense fallback={<SectionLoader />}>
                  <CertificateSection />
                </Suspense>
              )} */}

              {activeTab === "Projects" && (
                <Suspense fallback={<SectionLoader />}>
                  <ProjectSection />
                </Suspense>
              )}

              {activeTab === "Posts" && (
                <Suspense fallback={<SectionLoader />}>
                  <UserPostsSection userId={CURRENT_USER_ID} />
                </Suspense>
              )}
              {activeTab === "Skills" && (
                <Suspense fallback={<SectionLoader />}>
                  <SkillsManager />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Current Subscription Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
        <CurrentSubscriptionCard />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} MyApp. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProfilePage;

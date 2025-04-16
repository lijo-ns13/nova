// ProfilePage.tsx
import React, { Suspense } from "react";
import Navbar from "../componets/NavBar";

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
const CertificateSection = React.lazy(
  () => import("../componets/Profile/CertificateSection")
);
const EducationSection = React.lazy(
  () => import("../componets/Profile/EducationSection")
);

// Loading component for suspense fallback
const SectionLoader = () => (
  <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero section with profile */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 pt-12 pb-24 shadow-lg">
        <Suspense fallback={<SectionLoader />}>
          <UserProfile />
        </Suspense>
      </div>

      {/* Main content with floating card look */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Settings
            </h2>
            <Suspense fallback={<div>Loading...</div>}>
              <AddSection />
            </Suspense>
          </div>

          {/* Profile sections with tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {["Experience", "Education", "Projects", "Certificates"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      className={`${
                        index === 0
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Content sections */}
            <div className="space-y-12">
              <Suspense fallback={<SectionLoader />}>
                <ExperienceSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <EducationSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <CertificateSection />
              </Suspense>

              <Suspense fallback={<SectionLoader />}>
                <ProjectSection />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 MyApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ProfilePage;
